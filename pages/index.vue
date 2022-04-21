<script lang="ts" setup>

import orderedByKey from '../utility/ordered'
import RuntimeStats from '~~/components/RuntimeStats.vue'
import useSortedCollection from '~~/composables/useSortedCollection'
import type { ActiveSortField, Evaluation, SortFunctions } from '~~/types'

const { data: evaluations, pending } = useLazyFetch<Evaluation[]>('/api/evaluationData')
const activeSortField = ref<ActiveSortField>({ field: 'created', direction: 'desc' })
const store = useModalStore()
store.searchTerm = ''
const sortFunctions: SortFunctions = {
  created: (evaluations: Evaluation[]) => evaluations.sort((a, z) => z.created.seconds - a.created.seconds),
  fScore: (evaluations: Evaluation[]) => evaluations.sort((a, z) => z.evaluationResult.avgFScore - a.evaluationResult.avgFScore),

}

const intersectionTarget = ref(null)
const { sortedAndSearchedCollection: sortedEvaluations, toggleActiveSortField }
= useSortedCollection(evaluations, pending, sortFunctions, activeSortField, ref(5), intersectionTarget)

definePageMeta({
  layout: 'default',
  pageTransition: {
    enterFromClass: 'translate-x-20 op-0',
    enterToClass: 'translate-x-0 op-100',
    leaveToClass: 'op-0 translate-x-20',
    leaveActiveClass: 'duration-5000',
    enterActiveClass: 'duration-5000',
    mode: 'out-in',
  },
})
</script>

<template>
  <div class="py-2 sm:py-5 flex justify-center overflow-hidden">
    <div container flex flex-col items-center>
      <div text-2xl font-bold mb-2 sm:mb-5>
        Evaluations Overview
      </div>
      <div class="flex items-center mb-3">
        <SortAndSearchCollection :keys="Object.keys(sortFunctions)" :toggle-active-sort-field="toggleActiveSortField" :active-sort-field="activeSortField" />
      </div>
      <ul v-if="!pending" flex gap-y-6 flex-col max-w-3xl w-screen px-2 sm:px-4>
        <div v-for="evaluation in sortedEvaluations" :key="evaluation.firestoreId" ring ring-gray-400 sm:px-4 px-2 py-2 shadow-md bg-white rounded-md>
          <div flex justify-between>
            <div text-gray-700 font-semibold text-sm>
              Avg. fScore: {{ evaluation.evaluationResult.avgFScore.toFixed(3) }}
            </div>
            <NuxtLink text-gray-600 hover:text-gray-800 flex items-center gap-x-2 :to="{name:'questionResult-evaluationId',params:{evaluationId: evaluation.firestoreId }}">
              <div h-5 w-5 i-bi:folder-symlink />
              <div text-sm font-semibold>
                Question Results
              </div>
            </NuxtLink>
          </div>
          <div mx-auto text-gray-600 mt-1 w-fit text-lg font-semibold>
            Training Config
          </div>
          <li flex>
            <table class="mt-1 flex-1 divide-y divide-gray-300  border-gray-300 border-2">
              <tbody class="bg-white">
                <!-- Odd row -->
                <tr v-for="(value,type,index) in orderedByKey(evaluation.trainingConfig)" :key="type" capitalize :class="index % 2 == 0 ? 'bg-gray-100': 'bg-white'">
                  <td class="py-1 pl-4 pr-3 text-sm font-semibold text-gray-700 sm:pl-6">
                    {{ type === "trainingfScoreThreshold" ? "fScoreThreshold" : type }}
                  </td>
                  <td class=" px-3 pl-4 text-right text-sm font-medium text-gray-700">
                    {{ value }}
                  </td>
                </tr>

                <!-- More people... -->
              </tbody>
            </table>
          </li>
          <div mx-auto text-gray-600 w-fit text-lg font-semibold>
            Metric Config
          </div>
          <li flex>
            <table class="mt-1 flex-1 divide-y divide-gray-300  border-gray-300 border-2">
              <tbody class="bg-white">
                <!-- Odd row -->
                <tr v-for="(metric,index) in evaluation.metricConfigs" :key="metric.name" :class="index % 2 == 0 ? 'bg-gray-100': 'bg-white'">
                  <td class="py-1 pl-4 pr-3 text-sm font-semibold text-gray-700 sm:pl-6">
                    {{ metric.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 pl-4 font-medium text-right text-sm text-gray-700">
                    {{ metric.weight.toFixed(3) }}
                  </td>
                </tr>

                <!-- More people... -->
              </tbody>
            </table>
          </li>
          <div mx-auto w-fit text-gray-600 text-lg font-semibold>
            NLP Modules
          </div>
          <li flex>
            <table class="flex-1 mt-1 divide-y divide-gray-300 border-2 border-gray-300">
              <tbody class="bg-white">
                <!-- Odd row -->
                <tr v-for="(modules,type,index) in orderedByKey(evaluation.nlpConfig)" :key="type" capitalize :class="index % 2 == 0 ? 'bg-gray-100': 'bg-white'">
                  <td class="py-1 pl-4 pr-3 text-sm font-semibold text-gray-700 sm:pl-6">
                    {{ type }}
                  </td>
                  <td class="px-3 p1-4 text-right font-medium text-sm text-gray-700">
                    <div v-for="(module) in modules" :key="module" class="mt-1">
                      {{ module }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </li>
          <RuntimeStats mt-2 :evaluation="evaluation" />
          <div class="flex mt-2 justify-end">
            <div text-gray-700 flex items-center gap-x-1>
              <div i-ic:baseline-access-time />

              <div text-sm font-semibold>
                {{ new Date(evaluation.created.seconds * 1000 ).toLocaleString("en-US",{dateStyle:'medium',timeStyle:'medium',hourCycle:'h24'}) }}
              </div>
            </div>
          </div>
        </div>
      </ul>
      <div v-if="!pending" ref="intersectionTarget" />
    </div>
  </div>
</template>
