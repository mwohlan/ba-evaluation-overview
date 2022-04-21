<script setup>
const store = useModalStore()
const { Ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k' && e.type === 'keydown')
      e.preventDefault()
  },
})
whenever(Ctrl_k, () => {
  store.isOpen = !store.isOpen
})
</script>

<template>
  <main class="h-screen w-screen sib bg-warm-gray-100 overflow-x-hidden overflow-y-auto font-mulish">
    <Link rel="icon" type="image/x-icon" href="/favicon.svg" />
    <slot />
    <LazySearchModal v-if="store.isOpen" :is-open="store.isOpen" />
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
</style>
