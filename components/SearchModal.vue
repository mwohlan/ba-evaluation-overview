<script lang="ts" setup>
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

const { Ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k' && e.type === 'keydown')
      e.preventDefault()
  },
})

const store = useModalStore()
function closeModal() {
  store.isOpen = false
}

const changeValue = useDebounceFn((value) => {
  store.searchTerm = value
},
500)

whenever(Ctrl_k, () => {
  store.isOpen = true
})

</script>

<template>
  <div>
    <TransitionRoot appear :show="store.isOpen" as="template">
      <Dialog as="div" @close="closeModal">
        <div class="fixed flex justify-center items-center inset-0 z-10 overflow-y-auto">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
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
              <DialogTitle
                class="hidden"
              >
                Search Items
              </DialogTitle>

              <div class="relative">
                <input
                  id="id1" :value="store.searchTerm"
                  type="search" autocomplete="off" name="name1" placeholder="your name" class="peer pl-11 relative text-gray-600 font-semibold bg-light-50  w-full placeholder-transparent outline-none focus:outline-none border border-gray-300 focus:border-gray-400 rounded-lg p-4" @input="(e: InputEvent) => changeValue(e.target.value)"
                >
                <label for="id1" class="bg-light-50 duration-150 absolute z-[10] left-9 px-2 -top-2 text-gray-600 duration-150 text-xs peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 !peer-focus:-top-2 !peer-focus:text-gray-600 !peer-focus:text-xs">Search Evaluations</label>
                <div text-gray-400 absolute z-10 h-6 w-6 top-5 left-2 i-ic:outline-search />
                <div v-if="store.searchTerm !== ''" mt-3 text-gray-600>
                  Number of results: {{ store.numberOfSearchResults }}
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<style>
/* Remove chrome autofill colors */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active  {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
}
</style>
