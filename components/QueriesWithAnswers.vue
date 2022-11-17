<script lang="ts" setup>
import type { Answer } from '../types'

const props = defineProps<{
  answer: Answer
}>()
</script>

<template>
  <div ring-2 ring-gray-300>
    <div class="flex  gap-x-2 sm:px-6 px-3 justify-between items-center py-1.5 bg-gray-100">
      <div class=" text-sm font-semibold text-gray-700">
        Query
      </div>
      <div class="text-sm font-medium text-gray-700">
        {{ answer.query }}
      </div>
    </div>
    <div class="flex  sm:px-6 px-3 py-1.5 items-center justify-between bg-white">
      <div class=" text-sm font-semibold text-gray-700">
        fScore
      </div>
      <div class="text-sm font-medium text-gray-700">
        {{ answer.fScore.toFixed(2) }}
      </div>
    </div>
    <ShowAnswers bg-gray-100 :values="answer.values" />
  </div>
</template>
