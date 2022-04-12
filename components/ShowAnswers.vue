<script lang="ts" setup>
import isValidUrl from '../utility/checkValidUrl'
import isResource from '../utility/checkResource'

const [showAnswers, toggleAnswers] = useToggle(false)

const props = defineProps<{
  values: Array<string>
}>()

</script>
<template>
  <div>
    <div flex cursor-pointer gap-x-2 justify-center class="py-1.5" text-sm @click="toggleAnswers()">
      <div v-if="values.length > 0" text-gray-900>
        {{ showAnswers ? 'Hide':'Show' }} Answers
      </div>
      <div v-else text-gray-900>
        No Answers
      </div>
      <div v-if="!showAnswers && values.length > 0" i-ic:outline-keyboard-arrow-down h-5 w-5 />
      <div v-else-if="showAnswers && values.length > 0" i-ic:outline-keyboard-arrow-up h-5 w-5 />
    </div>
    <div v-if="showAnswers && values.length > 0" class="flex flex-wrap items-center gap-x-3 divide-x divide-gray-300  gap-y-1 py-2 px-2 sm:px-4">
      <div v-for="value in values" :key="value" class="text-sm pl-3 text-gray-700">
        <NuxtLink v-if="isValidUrl(value)" flex gap-x-1 justify-center items-center :to="value" target="_blank">
          {{ value.split('/').pop() }} <div class="h-3.5 w-3.5" i-ri:external-link-line />
        </NuxtLink>
        <NuxtLink v-else-if="isResource(value)" flex gap-x-1 justify-center items-center :to="`https://www.wikidata.org/wiki/Special:EntityData/${value.split(' ')[0]}`" target="_blank">
          {{ value.split('/').pop() }} <div class="h-3.5 w-3.5" i-ri:external-link-line />
        </NuxtLink>
        <div v-else>
          {{ value }}
        </div>
      </div>
    </div>
  </div>
</template>
