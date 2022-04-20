<script lang="ts" setup>
import type { ActiveSortField, Question, QuestionResult } from '../../types'
import orderedByKey from '../../utility/ordered'

const route = useRoute()

const store = useModalStore()

const { data: questions, pending: pendingQuestions } = useLazyFetch<Question[]>('/api/questionsData', { params: route.params })
const { data: questionResults, pending: pendingQuestionsResults } = useLazyFetch<QuestionResult[]>('/api/questionResultData', { params: route.params })

const activeSortField = ref<ActiveSortField>({ field: 'id', direction: 'asc' })

const intersectionTarget = ref(null)

const sortFunctions = {
  id: (questionResults: QuestionResult[]) => questionResults.sort((a, z) => z.id - a.id),
  fScore: (questionResults: QuestionResult[]) => questionResults.sort((a, z) => z.fScore - a.fScore),

}

const { sortedAndSearchedCollection: sortedQuestionResults, toggleActiveSortField }
= useSortedCollection(questionResults, computed(() => pendingQuestionsResults.value || pendingQuestions.value), sortFunctions, activeSortField, ref(5), intersectionTarget)

const wordAlternatives = (question: Question) => {
  const wordAlternatives = []
  question?.formattedQuestion.split(' ')?.forEach((word) => {
    wordAlternatives
      .push(question.wordAlternatives[word]
        .filter(alternative => alternative !== word)
        .reduce((prev, curr) => prev.concat(curr, ', '), `${word} => `))
  })
  return wordAlternatives
}
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
        <div text-2xl font-bold mb-2 sm:mb-5 @click="pendingQuestions = true">
          Question Results
        </div>
        <div class="flex items-center mb-3">
          <SortAndSearchCollection :keys="Object.keys(sortFunctions)" :toggle-active-sort-field="toggleActiveSortField" :active-sort-field="activeSortField" />
        </div>

        <ul id="list" gap-y-4 flex flex-col max-w-3xl w-screen px-2 sm:px-4>
          <div v-if="pendingQuestionsResults || pendingQuestions" self-center text-gray-700 w-14 h-14 i-eos-icons:loading />
          <li v-for="questionResult in sortedQuestionResults" v-else :key="questionResult.evaluationId" ring ring-gray-400 sm:px-4 px-2 py-2 space-y-4 w-full shadow-md bg-white rounded-md>
            <div flex justify-between>
              <NuxtLink text-gray-600 hover:text-gray-800 flex items-center gap-x-2 :to="{name:'index'}">
                <div h-5 w-5 i-ic:outline-arrow-back />
                <div text-sm font-semibold>
                  Back
                </div>
              </NuxtLink>
              <NuxtLink text-gray-600 hover:text-gray-800 flex items-center gap-x-2 :to="{ name:'queryTemplates-evaluationId-questionId', params:{evaluationId: questionResult.evaluationId, questionId: questionResult.id}}">
                <div h-5 w-5 i-bi:folder-symlink />
                <div text-sm font-semibold>
                  Query Templates
                </div>
              </NuxtLink>
            </div>
            <div flex flex-col flex-1>
              <div mx-auto w-fit text-gray-700 text-lg font-semibold>
                Info
              </div>

              <div border-gray-300 border-2>
                <div class="flex gap-x-2 justify-between items-center py-1 sm:px-6 px-3 bg-white">
                  <div class=" text-sm font-semibold text-gray-700">
                    Question
                  </div>
                  <div class="text-sm font-medium text-gray-700">
                    {{ questionResult.originalQuestion }}
                  </div>
                </div>
                <div class="flex justify-between items-center py-1 sm:px-6 px-3 bg-gray-100 ">
                  <div class=" text-sm font-semibold text-gray-700">
                    Id
                  </div>
                  <div class="text-sm font-medium text-gray-700">
                    {{ questionResult.id }}
                  </div>
                </div>
                <div class="flex justify-between items-center py-1 sm:px-6 px-3 bg-white ">
                  <div class=" text-sm font-semibold text-gray-700">
                    Fscore
                  </div>
                  <div class="text-sm font-medium text-gray-700">
                    {{ questionResult.fScore.toFixed(3) }}
                  </div>
                </div>

                <div class="flex gap-x-2 justify-between items-center py-1 sm:px-6 px-3 bg-gray-100">
                  <div class=" text-sm font-semibold text-gray-700">
                    Bench Resources
                  </div>
                  <div flex-1 flex flex-wrap justify-end gap-x-1>
                    <NuxtLink
                      v-for="(resource,index) in questionResult.benchResources.sort()" :key="resource" flex
                      items-center class="text-sm gap-x-0.5 font-medium text-gray-700" :to="`https://www.wikidata.org/wiki/Special:EntityData/${resource.split(' ')[0]}`" target="_blank"
                    >
                      <div>{{ resource }}</div>
                      <div class="h-3 w-3" i-ri:external-link-line />
                      <div> {{ index +1 == questionResult.benchResources.length ? "" : ", " }}</div>
                    </NuxtLink>
                  </div>
                </div>
                <div class="flex gap-x-2  justify-between items-center py-1 sm:px-6 px-3 bg-white">
                  <div class=" text-sm font-semibold text-gray-700">
                    Matched Resources
                  </div>
                  <div flex-1 flex flex-wrap justify-end gap-x-1>
                    <NuxtLink
                      v-for="(resource,index) in questionResult.resources.filter(resource =>
                        resource.name !== 'Variable').sort()"
                      :key="resource.name" flex
                      items-center class="text-sm gap-x-0.5 font-medium text-gray-700" :to="`https://www.wikidata.org/wiki/Special:EntityData/${resource.name.split(' ')[0]}`" target="_blank"
                    >
                      <div>{{ resource.name }}</div>
                      <div class="h-3 w-3" i-ri:external-link-line />
                      <div> {{ index +1 == questionResult.resources.filter( value => value.name != "Variable").length ? "" : ", " }}</div>
                    </NuxtLink>
                  </div>
                </div>
                <div class="flex gap-x-2 justify-between items-center py-1 sm:px-6 px-3 bg-gray-100">
                  <div class=" text-sm font-semibold text-gray-700">
                    Fail Reasons
                  </div>
                  <div class="text-sm font-medium text-gray-700">
                    {{ questionResult.likelyFailReasons.length >0 ? questionResult.likelyFailReasons.join(', ') : 'None' }}
                  </div>
                </div>
                <div class="flex gap-x-3 justify-between items-center py-1 sm:px-6 px-3 bg-gray-white">
                  <div class="flex-shrink-0 text-sm font-semibold text-gray-700">
                    Bench Query
                  </div>
                  <div class="text-sm font-medium text-gray-700">
                    {{ questionResult.benchQuery }}
                  </div>
                </div>
                <ShowAnswers bg-white pt-2 :values="questionResult.benchAnswers" />
                <ShowData bg-gray-100 :values="questions.find(question => question.id === questionResult.id).additionalWords" :name="'Additional Words'" />
                <ShowData :values="wordAlternatives(questions.find(question => question.id === questionResult.id))" :name="'Word Alternatives'" />
                <ShowData bg-gray-100 :values="questions.find(question => question.id === questionResult.id).nGrams" :name="'Ngrams'" />
              </div>

              <!-- More people... -->
            </div>

            <div v-if="questionResult.answers.length > 0" flex flex-col flex-1>
              <div mx-auto w-fit text-gray-700 text-lg font-semibold>
                Best Ranked Answers
              </div>

              <div space-y-4>
                <template v-for="(answer,index) in orderedByKey(questionResult.answers)" :key="answer.query">
                  <QueriesWithAnswers :answer="answer" :index="+index" />
                </template>
              </div>

              <!-- More people... -->
            </div>
            <div class="flex justify-end items-center gap-x-2 text-gray-700">
              <div i-ic:baseline-access-time />
              <div text-sm font-semibold>
                {{ new Date(questionResults[0].created.seconds * 1000 ).toLocaleString("en-US",{dateStyle:'medium',timeStyle:'medium',hourCycle:'h24'}) }}
              </div>
            </div>
          </li>
        </ul>
        <div v-if="!pendingQuestionsResults" ref="intersectionTarget" />
      </div>
    </div>
  </div>
</template>
