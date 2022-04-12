<script lang="ts" setup>
import type { QueryTemplate, Question } from '../../types'
import orderedByKey from '../../utility/ordered'

const route = useRoute()
const { data: queryTemplates, pending } = await useLazyFetch<QueryTemplate[]>('/api/queryTemplateData', { params: route.params })

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
    <div class="py-2 sm:py-5 flex justify-center overflow-hidden">
      <div container flex flex-col items-center>
        <div text-2xl font-bold mb-10>
          Query Templates
        </div>
        <div v-if="pending" self-center text-gray-700 w-14 h-14 i-eos-icons:loading />

        <ul v-else gap-y-4 flex flex-col max-w-3xl w-screen px-2 sm:px-4>
          <li v-for="(queryTemplate, index) in queryTemplates.sort((a,z) => z.totalScore.normalizedWeighted - a.totalScore.normalizedWeighted)" :key="queryTemplate.answers[0].query" px-3 py-2 space-y-4 w-full shadow-md bg-white rounded-md>
            <div flex justify-between>
              <NuxtLink text-gray-600 hover:text-gray-800 flex items-center gap-x-2 :to="{name:'questionResult-evaluationId',params:{evaluationId: queryTemplate.evaluationId}}">
                <div h-5 w-5 i-ic:outline-arrow-back />
                <div text-sm font-semibold>
                  Back
                </div>
              </NuxtLink>
              <div text-sm>
                Rank {{ index+1 }}
              </div>
            </div>
            <div flex flex-col flex-1>
              <div mx-auto w-fit text-gray-700 text-lg font-semibold>
                Info
              </div>

              <div border-gray-300 border-2>
                <div class="flex gap-x-2 justify-between py-1 px-3 bg-gray-100">
                  <div class=" text-sm font-medium text-gray-900">
                    Type
                  </div>
                  <div class="text-sm text-gray-700">
                    {{ queryTemplate.template }}
                  </div>
                </div>

                <div class="flex gap-x-2 justify-between py-1 px-3 bg-white">
                  <div class=" text-sm font-medium text-gray-900">
                    Query Scores
                  </div>
                  <div class="text-sm space-y-1 text-gray-700">
                    <div v-for="queryScore in queryTemplate.queryScores" :key="queryScore.metric" flex gap-x-3 justify-between>
                      <div>
                        {{ queryScore.metric }}:
                      </div>
                      <div>
                        {{ queryScore.score.normalizedWeighted.toFixed(3) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex gap-x-2 justify-between py-1 px-3 bg-gray-100">
                  <div class=" text-sm font-medium text-gray-900">
                    Total Score
                  </div>
                  <div class="text-sm text-gray-700">
                    {{ queryTemplate.totalScore.normalizedWeighted.toFixed(3) }}
                  </div>
                </div>
                <div class="flex gap-x-2 justify-between py-1 px-3 bg-white">
                  <div class=" text-sm font-medium text-gray-900">
                    Resources
                  </div>
                  <div class="text-sm space-y-1 text-gray-700">
                    <div v-for="resource in queryTemplate.resources" :key="resource.name" flex gap-x-3 justify-between>
                      <div>
                        {{ resource.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div flex flex-col flex-1>
                <div mx-auto w-fit text-gray-700 text-lg font-semibold>
                  Best Ranked Answers
                </div>

                <div space-y-4>
                  <template v-for="(answer) in orderedByKey(queryTemplate.answers)" :key="answer.query">
                    <QueriesWithAnswers :answer="answer" />
                  </template>
                </div>

                <!-- More people... -->
              </div>
            </div>
            <div class="flex mt-1 justify-end items-center gap-x-2">
              <div i-ic:baseline-access-time />
              <div text-sm font-semibold>
                {{ new Date(queryTemplate?.created?.seconds * 1000 ).toLocaleString("en-US",{dateStyle:'medium',timeStyle:'medium',hourCycle:'h24'}) }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
