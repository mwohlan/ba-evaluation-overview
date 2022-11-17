import type { Ref } from '@vue/reactivity'
import { storeToRefs } from 'pinia'
import Fuse from 'fuse.js'
import type { ActiveSortField } from '../types'

export default function <T>(collection: Ref<T[]>, pending: Ref<boolean>, sortFunctions: Record<string, (collection: T[]) => T[]>, activeSortField: Ref<ActiveSortField>, numberOfResults: Ref<number>, intersectionTarget: Ref<HTMLInputElement | null>) {
  const modal = useModalStore()

  const toggleActiveSortField = (sortField: 'created' | 'fScore' | 'id' | 'rank') => {
    if (sortField !== activeSortField.value.field)
      activeSortField.value = { field: sortField, direction: 'desc' }

    else
      activeSortField.value = { field: sortField, direction: activeSortField.value.direction === 'desc' ? 'asc' : 'desc' }
  }

  const sortedCollection = computed(() => {
    const sortFunction = sortFunctions[activeSortField.value.field]
    if (pending.value)
      return []

    return activeSortField.value.direction === 'desc'
      ? sortFunction(collection.value).slice(0, numberOfResults.value)
      : sortFunction(collection.value).reverse().slice(0, numberOfResults.value)
  })

  const { searchTerm } = storeToRefs(modal)

  const fuse = computed(() => {
    return new Fuse(collection.value, {
      keys: ['trainingConfig.testSet', 'originalQuestion', 'id', 'resources.name', 'answers.values', 'benchResources', 'benchAnswers', 'likelyFailReasons', 'nlpConfig.additionalWords', 'nlpConfig.wordAlternatives', 'nlpConfig.nGrams', 'nlpConfig.formatters'],
      threshold: 0.4,
    },
    )
  })
  const sortedAndSearchedCollection = computed(() => {
    return searchTerm.value !== ''
      ? fuse.value.search(searchTerm.value).map(({ item }) => item)
      : sortedCollection.value
  })

  const scroll = useInfiniteScroll(intersectionTarget, () => {
    console.log('scrolled')
  }
  , { distance: 500 })

  const { stop } = useIntersectionObserver(
    intersectionTarget,
    ([{ isIntersecting }]) => {
      if (isIntersecting && !modal.isOpen)
        numberOfResults.value = Math.min(numberOfResults.value + 10, collection.value?.length ?? 0)
    },
    {
      rootMargin: '200px',
    },
  )

  watch(sortedAndSearchedCollection, () => {
    modal.numberOfSearchResults = sortedAndSearchedCollection.value.length
  })

  onUnmounted(() => {
    stop()
  })

  return {
    sortedAndSearchedCollection,
    toggleActiveSortField,
  }
}
