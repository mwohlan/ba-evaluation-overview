<script lang="ts" setup>
const props = defineProps<{
  show: boolean
  message: string
}>()
const emit = defineEmits(['closeToast'])
const { show, message } = toRefs(props)

whenever(show, () => {
  setTimeout(() => {
    emit('closeToast')
  }, 5000)
}, { immediate: true })
</script>

<template>
  <div>
    <ClientOnly>
      <Teleport to="body">
        <Transition
          enter-from-class="translate-x-20 op-0"
          enter-to-class="translate-x-0 op-100"
          leave-to-class="op-0 translate-x-20"
        >
          <div v-if="show" duration-300 absolute top-10 right-10>
            <div border-l-3 relative border-green-600 bg-green-300 text-green-600 px-8 py-2>
              <div>
                {{ message }}
              </div>
              <div absolute text-green-600 top-1 right-1 i-ic:outline-cancel @click="emit('closeToast')" />
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<style scoped></style>
