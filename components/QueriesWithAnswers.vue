<script lang="ts" setup>

import type { Answer } from '../types'

const props = defineProps<{
  answer: Answer
}>()

</script>

<template>
  <div ring-2 ring-gray-300>
    <div class="flex  gap-x-2 px-4 justify-between py-1.5 bg-gray-100">
      <div class=" text-sm font-medium text-gray-900">
        Query
      </div>
      <div class="text-sm text-gray-700">
        {{ answer.query }}
      </div>
    </div>
    <div class="flex  px-4 py-1.5 justify-between bg-white">
      <div class=" text-sm font-medium text-gray-900">
        fScore
      </div>
      <div class="text-sm text-gray-700">
        {{ answer.fScore.toFixed(2) }}
      </div>
    </div>
    <ShowAnswers bg-gray-100 :values="answer.values" />
  </div>
</template>
