<script setup>
const modal = useModalStore()
const user = useSupabaseUser()
const client = useSupabaseClient()
const route = useRoute()
const mode = useColorMode()
const signOut = () => {
  client.auth.signOut()
}

const { Ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k' && e.type === 'keydown')
      e.preventDefault()
  },
})
whenever(Ctrl_k, () => {
  modal.isOpen = !modal.isOpen
})

const main = ref(null)

const { x, y } = useScroll(main)

watch(() => route.name, () => {
  setTimeout(() => {
    const elem = document.getElementById('main')
    elem.scrollTo({ top: 0, behavior: 'smooth' })
  }, 700)
})
</script>

<template>
  <main id="main" ref="main" dark="bg-warm-gray-800 text-gray-200" class="h-screen w-screen text-gray-600   bg-warm-gray-100 overflow-x-hidden overflow-y-auto font-mulish">
    <div v-if="user && route.name !== 'login'" bg-gray-300 py-1 px-3 rounded-md shadow-md cursor-pointer absolute right-4 top-5 gap-x-1 flex items-center @click="signOut">
      <div i-fe:logout />
      <div>
        {{ user?.email.split('@')[0] }}
      </div>
    </div>
    <Link rel="icon" type="image/x-icon" href="/favicon.svg" />
    <slot />
    <LazySearchModal :is-open="modal.isOpen" />
  </main>
</template>

<style>
/* @import '~/styles/main.css'; */

/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(190, 183, 183);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

html { height: 100%; overflow:auto; }
body { height: 100%; }
</style>
