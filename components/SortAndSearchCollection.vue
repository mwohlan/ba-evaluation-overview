<script lang="ts"
setup
>
import type { ActiveSortField } from '~/types'

const props = defineProps<{
  activeSortField: ActiveSortField
  toggleActiveSortField: (field: 'created' | 'fScore' | 'id' | 'rank') => void
  keys: string[]
}>()

const modal = useModalStore()
</script>

<template>
  <div flex gap-x-3 cursor-pointer>
    <template v-for="key in keys" :key="key">
      <div :class="activeSortField.field === key ? 'font-semibold text-gray-800' : 'font-normal text-gray-600'" flex gap-x-1 items-center px-3 bg-gray-300 rounded-lg @click="toggleActiveSortField(key)">
        <div>
          {{ key }}
        </div>
        <div
          v-if="activeSortField.field === key && activeSortField.direction === 'asc'"
          shrink
          h-4 w-4
          i-octicon:sort-asc-16
        />
        <div
          v-if="activeSortField.field === key && activeSortField.direction === 'desc'"
          h-4
          w-4
          shrink i-octicon:sort-desc-16
        />
      </div>
    </template>
  </div>
  <button py-1 px-2 rounded-lg bg-gray-300 flex ml-3 @click="modal.isOpen = !modal.isOpen">
    <div cursor-pointer text-gray-700 h-4 w-4 i-ic:outline-search />
    <kbd ml-1 tracking-tighter self-end text="2.4">Strg + k</kbd>
  </button>
  <div v-if="modal.searchTerm !== ''" ml-2>
    <div text-xs>
      {{ modal.numberOfSearchResults }} results for:
    </div>
    <div flex items-center gap-x-1>
      <div text-xs font-semibold>
        {{ modal.searchTerm }}
      </div>
      <div cursor-pointer h-4 w-4 i-ic:outline-cancel @click="modal.searchTerm = ''" />
    </div>
  </div>
</template>
