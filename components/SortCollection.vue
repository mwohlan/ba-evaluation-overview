<script lang="ts" setup>

import type { ActiveSortField } from '../types'

const props = defineProps<{
  activeSortField: ActiveSortField
  toggleActiveSortField: (field: 'created'|'fScore' | 'id' | 'rank') => void
  keys: string[]
}>()

</script>

<template>
  <div mb-3 flex gap-x-3 cursor-pointer>
    <template v-for="key in keys" :key="key">
      <div :class="activeSortField.field === key ? 'font-semibold text-gray-800':'font-normal text-gray-600'" flex gap-x-1 items-center px-3 bg-gray-300 rounded-lg @click="toggleActiveSortField(key)">
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
</template>
