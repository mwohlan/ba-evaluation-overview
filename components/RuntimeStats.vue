<script lang="ts" setup>
import orderedByKey from '../utility/ordered'
import type { Evaluation } from '../types'
const props = defineProps<{
  evaluation: Evaluation
}>()
const [showRuntimeStats, toggleRuntimeStats] = useToggle(false)
</script>

<template>
  <div>
    <div hover:text-gray-800 cursor-pointer flex justify-center items-center gap-x-2 text-gray-600 text-lg font-semibold @click="()=>toggleRuntimeStats()">
      <div>
        {{ showRuntimeStats ? 'Hide':'Show' }} Runtime Stats
      </div>
      <div v-if="!showRuntimeStats" i-ic:outline-keyboard-arrow-down h-5 w-5 />
      <div v-else i-ic:outline-keyboard-arrow-up h-5 w-5 />
    </div>
    <li v-if="showRuntimeStats" flex>
      <table class="mt-1 flex-1 divide-y divide-gray-300 border-2 border-gray-300">
        <tbody class="bg-white">
          <!-- Odd row -->
          <tr v-for="(value,setting,index) in orderedByKey(evaluation.settings)" :key="setting" capitalize :class="index % 2 == 0 ? 'bg-gray-100': 'bg-white'">
            <td class=" py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              {{ setting }}
            </td>
            <td class=" px-3 p1-4 text-right text-sm text-gray-700">
              {{ value }}
            </td>
          </tr>
          <tr v-for="(value,setting,index) in orderedByKey(evaluation.evaluationResult.runtimeStats)" :key="setting" capitalize :class="(Object.keys(evaluation.settings).length + index) % 2 == 0 ? 'bg-gray-100': 'bg-white'">
            <td class=" py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              {{ setting }}
            </td>
            <td class=" px-3 p1-4 text-right text-sm text-gray-700">
              {{ setting.includes('Time') ? value.toFixed(2) : value }}{{ setting.includes('Time') ? 's':'' }}
            </td>
          </tr>

          <!-- More people... -->
        </tbody>
      </table>
    </li>
  </div>
</template>

<style scoped></style>
