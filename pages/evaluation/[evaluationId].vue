<script lang="ts" setup>
import type { QuestionResult } from '../../types'

const route = useRoute()

const { data: questionResults } = await useLazyFetch<QuestionResult[]>('/api/questionResultData', { params: route.params })

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
  <div>
    <div class="p-5 flex justify-center overflow-hidden">
      <div container flex flex-col items-center>
        <div text-2xl font-bold mb-10>
          Question Results
        </div>

        <ul gap-y-4 flex flex-col max-w-2xl w-screen px-4 relative>
          <div v-for="questionResult in questionResults" :key="questionResult.evaluationId" px-3 py-2 space-y-4 w-full shadow-md bg-white rounded-md>
            <div flex justify-between>
              <NuxtLink text-gray-600 hover:text-gray-800 flex items-center gap-x-2 :to="{name:'index'}">
                <div h-5 w-5 i-ic:outline-arrow-back />
                <div text-sm font-semibold>
                  Back
                </div>
              </NuxtLink>
              <div text-gray-900 font-semibold text-sm w-fit ml-auto>
                fScore: {{ questionResult.fScore.toFixed(3) }}
              </div>
            </div>
            <div class="flex flex-wrap gap-x-2 peer-focus:bg-light-100">
              <li flex>
                <div flex flex-col class=" mt-4">
                  <ul class=" ml-5">
                    <div mx-auto w-fit text-gray-700 text-lg font-semibold>
                      Queries
                    </div>
                    <li v-for="answer in questionResult.answers" :key="answer.query">
                      {{ answer }}
                    </li>
                  </ul>
                </div>
              </li>

              <div class="flex justify-end items-center gap-x-2">
                <div i-ic:baseline-access-time />
                <div text-sm font-semibold>
                  {{ new Date(questionResult.created.seconds * 1000 ).toLocaleString("en-US",{dateStyle:'medium',timeStyle:'medium',hourCycle:'h24'}) }}
                </div>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>
