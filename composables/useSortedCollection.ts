import type { Ref } from '@vue/reactivity'
import type { ActiveSortField } from '../types'

export default function <T>(collection: Ref<T[]>, sortFunctions: Record<string, (collection: T[]) => T[]>, activeSortField: Ref<ActiveSortField>, numberOfResults: Ref<number>, intersectionTarget: Ref<HTMLInputElement | null>) {
  const toggleActiveSortField = (sortField: 'created'|'fScore' | 'id' | 'rank') => {
    if (sortField !== activeSortField.value.field)
      activeSortField.value = { field: sortField, direction: 'desc' }

    else
      activeSortField.value = { field: sortField, direction: activeSortField.value.direction === 'desc' ? 'asc' : 'desc' }
  }

  const sortedCollection = computed(() => {
    const sortFunction = sortFunctions[activeSortField.value.field]
    return activeSortField.value.direction === 'desc'
      ? sortFunction(collection.value).slice(0, numberOfResults.value)
      : sortFunction(collection.value).reverse().slice(0, numberOfResults.value)
  })

  const { stop } = useIntersectionObserver(
    intersectionTarget,
    ([{ isIntersecting }]) => {
      if (isIntersecting)
        numberOfResults.value = Math.min(numberOfResults.value + 10, collection.value?.length ?? 0)
    },
    {
      rootMargin: '200px',
    },
  )

  onUnmounted(() => {
    stop()
  })

  return {
    sortedCollection,
    toggleActiveSortField,
  }
}
