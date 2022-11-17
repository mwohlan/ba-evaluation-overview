<script lang="ts" setup>
import isValidUrl from '../utility/checkValidUrl'

const props = defineProps<{
  values: Array<string>
  name: String
}>()

const [showData, toogleData] = useToggle(false)
</script>

<template>
  <div v-auto-animate>
    <div flex cursor-pointer gap-x-2 justify-center class="py-1.5" text-sm @click="toogleData()">
      <div text-gray-900>
        {{ showData ? 'Hide' : 'Show' }} {{ name }}
      </div>
      <div v-if="!showData" i-ic:outline-keyboard-arrow-down h-5 w-5 />
      <div v-else i-ic:outline-keyboard-arrow-up h-5 w-5 />
    </div>
    <div v-if="showData" class="flex flex-wrap items-center gap-x-3 divide-x divide-gray-300  gap-y-1 py-2 px-2 sm:px-4">
      <div v-for="value in values" :key="value" class="text-sm font-medium text-gray-700">
        <NuxtLink v-if="isValidUrl(value)" flex gap-x-1 justify-center items-center :to="value" target="_blank">
          {{ value.split('/').pop() }} <div class="h-3.5 w-3.5" i-ri:external-link-line />
        </NuxtLink>
        <div v-else pl-3>
          {{ value }}
        </div>
      </div>
    </div>
  </div>
</template>
