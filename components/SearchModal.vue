<script lang="ts" setup>
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

const store = useModalStore()
function closeModal() {
  store.isOpen = false
}

const loading = ref(false)

const localValue = ref(store.searchTerm)

watch(() => store.searchTerm, () => {
  if (store.searchTerm === '')
    localValue.value = ''
})

watchDebounced(
  localValue,
  () => {
    store.searchTerm = localValue.value
    loading.value = false
  },
  { debounce: 500 },
)
</script>

<template>
  <TransitionRoot :show="store.isOpen" as="template">
    <Dialog as="div" @close="closeModal">
      <div class="fixed flex justify-center items-center inset-0 z-10 overflow-y-auto">
        <TransitionChild
          as="template"
          enter="duration-3000 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 -z-1 bg-black opacity-20" />
        </TransitionChild>

        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <div
            class="z-10 max-w-md px-6 py-3 overflow-hidden bg-light-100 op-100 shadow-xl rounded-lg"
          >
            <div class="relative">
              <input
                id="id1"
                :value="localValue"
                type="text"
                autocomplete="off"
                name="name1"
                placeholder="your name"
                class="peer pl-11 text-gray-600 font-semibold bg-light-50  w-full placeholder-transparent outline-none focus:outline-none border border-gray-300 focus:border-gray-400 rounded-lg p-4"
                @input="(e: Event) => { loading = true;localValue = e.target.value }"
                @keypress="(e: KeyboardEvent) => { if (e.key === 'Enter') { closeModal() } }"
              >
              <label
                for="id1"
                class="bg-light-50 duration-150 absolute z-[10] left-9 px-2 -top-2 text-gray-600 duration-150 text-xs peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 !peer-focus:-top-2 !peer-focus:text-gray-600 !peer-focus:text-xs"
              >
                Search Evaluations</label>
              <div text-gray-400 absolute z-10 h-6 w-6 top-5 left-2 i-ic:outline-search />
              <div v-if="loading" mx-auto self-center w-7 mt-3 h-7 i-eos-icons:loading />
              <div v-else-if="!loading && store.searchTerm !== ''" mt-3 h-7 text-gray-600>
                Number of results: {{ store.numberOfSearchResults }}
              </div>
              <div v-else mt-3 h-7 />
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
