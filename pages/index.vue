<script lang="ts" setup>
import type { CollectionReference } from 'firebase/firestore'
import { collection, getDocs } from 'firebase/firestore'
import useFirestore from '../composables/useFirestore'
import type { Evaluation } from '../types'
import orderedByKey from '../utility/ordered'
import RuntimeStats from '~~/components/RuntimeStats.vue'
const db = useFirestore()

// const { data: evaluations } = await useFetch('/api/evaluationData', { lazy: true })
// const { data: evaluations } = await useLazyAsyncData<Evaluation[]> ('evaluations', async() => {
//   const collectionRef = collection(db, 'evaluations') as CollectionReference<Evaluation>
//   const snapshot = await getDocs(collectionRef)
//   return snapshot.docs.map(doc => doc.data())
// })
const { data: evaluations, pending } = await useLazyFetch<Evaluation[]>('/api/evaluationData')
const sortedEvaluations = computed(() => evaluations.value?.sort((a, z) => a.created.seconds - z.created.seconds).reverse().slice(0, 10))

const numberOfResults = ref(5)

const target = ref(null)

const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }], observerElement) => {
    if (isIntersecting)
      numberOfResults.value += 10
  },
  {
    rootMargin: '200px',
  },
)

onUnmounted(() => {
  stop()
})

definePageMeta({
  layout: 'default',
  pageTransition: {
    enterFromClass: 'translate-x-20 op-0',
    enterToClass: 'translate-x-0 op-100',
    leaveToClass: 'op-0 translate-x-20',
    leaveActiveClass: 'duration-300',
    enterActiveClass: 'duration-200',
    mode: 'out-in',
  },
})
</script>

<template>
  <div class="py-2 sm:py-5 flex justify-center overflow-hidden">
    <div container flex flex-col items-center>
      <div text-2xl font-bold mb-10>
        Evaluations Overview
      </div>
      <ul flex gap-y-6 flex-col max-w-3xl w-screen px-2 sm:px-4>
        <div v-for="evaluation in sortedEvaluations.slice(0,numberOfResults)" :key="evaluation.firestoreId" ring ring-gray-400 px-3 py-2 shadow-md bg-white rounded-md>
          <div flex justify-between>
            <div text-gray-900 font-semibold text-sm>
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
                  <td class="py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ type === "trainingfScoreThreshold" ? "fScoreThreshold" : type }}
                  </td>
                  <td class=" px-3 pl-4 text-right text-sm text-gray-700">
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
                  <td class="py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ metric.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 p1-4 text-right text-sm text-gray-700">
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
                  <td class="py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
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
            <div text-gray-900 flex items-center gap-x-1>
              <div i-ic:baseline-access-time />

              <div text-sm font-semibold>
                {{ new Date(evaluation.created.seconds * 1000 ).toLocaleString("en-US",{dateStyle:'medium',timeStyle:'medium',hourCycle:'h24'}) }}
              </div>
            </div>
          </div>
        </div>
      </ul>
      <div v-if="!pending" ref="target" />
    </div>
  </div>
</template>
