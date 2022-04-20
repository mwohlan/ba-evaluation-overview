<script lang="ts" setup>
import type { ActiveSortField, QueryTemplate } from '../../types'
import orderedByKey from '../../utility/ordered'

const route = useRoute()
const { data: queryTemplates, pending } = useLazyFetch<QueryTemplate[]>('/api/queryTemplateData', { params: route.params })
const store = useModalStore()
const activeSortField = ref<ActiveSortField>({ field: 'rank', direction: 'desc' })

const intersectionTarget = ref(null)

const sortFunctions = {
  rank: (queryTemplates: QueryTemplate[]) => queryTemplates.sort((a, z) => z.totalScore.normalizedWeighted - a.totalScore.normalizedWeighted),
  fScore: (queryTemplates: QueryTemplate[]) => queryTemplates.sort((a, z) => Math.max(...z.answers.map(a => a.fScore)) - Math.max(...a.answers.map(a => a.fScore))),

}

const { sortedAndSearchedCollection: sortedQueryTemplates, toggleActiveSortField }
= useSortedCollection(queryTemplates, pending, sortFunctions, activeSortField, ref(5), intersectionTarget)

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
        <div text-2xl font-bold mb-2 sm:mb-5>
          Query Templates
        </div>
        <div class="flex items-center mb-3">
          <SortAndSearchCollection :keys="Object.keys(sortFunctions)" :toggle-active-sort-field="toggleActiveSortField" :active-sort-field="activeSortField" />
        </div>
        <div v-if="pending" self-center text-gray-700 w-14 h-14 i-eos-icons:loading />
        <div v-else-if="sortedQueryTemplates.length == 0" px-3 py-2 flex gap-x-3 items-center bg-gray-300 rounded mt-4>
          <div i-icon-park-outline:caution h-8 w-8 text-yellow-600 />
          <div text-sm font-semibold text-gray-700>
            No query templates with fScore > 0 found
            <NuxtLink w-fit ml-auto mt-2 text-gray-600 hover:text-gray-800 flex items-center gap-x-2 :to="{name:'questionResult-evaluationId',params:{evaluationId: route.params.evaluationId}}">
              <div h-5 w-5 i-ic:outline-arrow-back />
              <div text-sm font-semibold>
                Back
              </div>
            </NuxtLink>
          </div>
        </div>

        <ul v-else id="list" gap-y-4 flex flex-col max-w-3xl w-screen px-2 sm:px-4>
          <li v-for="(queryTemplate, index) in sortedQueryTemplates" :key="queryTemplate.answers[0].query" px-2 sm:px-4 py-2 space-y-4 w-full shadow-md bg-white rounded-md>
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
                <div class="flex gap-x-2 justify-between py-1 sm:px-6 px-3 bg-gray-100">
                  <div class=" text-sm font-semibold text-gray-700">
                    Type
                  </div>
                  <div class="text-sm font-medium text-gray-700">
                    {{ queryTemplate.template }}
                  </div>
                </div>

                <div class="flex gap-x-2 items-center justify-between py-1 sm:px-6 px-3 bg-white">
                  <div class=" text-sm font-semibold text-gray-700">
                    Query Scores
                  </div>
                  <div class="text-sm space-y-1 font-medium text-gray-700">
                    <div v-for="queryScore in queryTemplate.queryScores" :key="queryScore.metric">
                      <VTooltip
                        :handle-resize="true"
                        :distance="10"
                        :delay="300"
                        :placement="'auto'"
                      >
                        <div flex gap-x-3 justify-between>
                          <div>
                            {{ queryScore.metric.replace('Avg', '') }}:
                          </div>
                          <div>
                            {{ queryScore.score.normalizedWeighted.toFixed(3) }} | {{ queryScore.score.normalized.toFixed(3) }}
                          </div>
                        </div>
                        <template #popper>
                          <div v-for="(score,key) in orderedByKey(queryScore.score)" :key="score" text-gray-700 font-medium text-sm>
                            <div class="flex gap-x-2 justify-between">
                              <div>
                                {{ key }}
                              </div>
                              <div>
                                {{ score.toFixed(3) }}
                              </div>
                            </div>
                          </div>
                        </template>
                      </VTooltip>
                    </div>
                  </div>
                </div>
                <div class="flex gap-x-2 justify-between py-1 sm:px-6 px-3 bg-gray-100">
                  <div class=" text-sm font-semibold text-gray-700">
                    Total Score
                  </div>
                  <div class="text-sm font-medium text-gray-700">
                    {{ queryTemplate.totalScore.normalizedWeighted.toFixed(3) }}
                  </div>
                </div>
                <div class="flex gap-x-2 justify-between items-center py-1 sm:px-6 px-3 bg-white">
                  <div class=" text-sm font-semibold text-gray-700">
                    Resources
                  </div>
                  <div class="text-sm space-y-1 font-medium text-gray-700">
                    <div v-for="resource in queryTemplate.resources" :key="resource.name" flex gap-x-3 justify-between>
                      <VTooltip :disabled="resource.resourceScores.length == 0">
                        <div>
                          {{ resource.name }}
                        </div>
                        <template #popper>
                          <div v-for="resourceScore in resource.resourceScores" :key="resourceScore.score" text-gray-700 font-medium text-sm>
                            {{ resourceScore.metric }}: {{ resourceScore.score.toFixed(3) }}{{ ` ( ${resourceScore.normalizer} )` }}
                          </div>
                        </template>
                      </VTooltip>
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
            <div class="flex mt-1 justify-end items-center gap-x-2 text-gray-700">
              <div i-ic:baseline-access-time />
              <div text-sm font-semibold>
                {{ new Date(queryTemplate?.created?.seconds * 1000 ).toLocaleString("en-US",{dateStyle:'medium',timeStyle:'medium',hourCycle:'h24'}) }}
              </div>
            </div>
          </li>
        </ul>
        <div v-if="!pending" ref="intersectionTarget" />
      </div>
    </div>
  </div>
</template>

<style>

.v-popper--theme-tooltip .v-popper__inner {
  background: rgb(219,223,229);
  padding: 7px;
  border-radius: 13px;
}

.v-popper--theme-tooltip .v-popper__arrow-outer {
  border-color:rgb(219,223,229);
}
</style>
