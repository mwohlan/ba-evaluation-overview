import { acceptHMRUpdate, defineStore } from 'pinia'

export const useModalStore = defineStore('modal', () => {
  /**
   * Current named of the user.
   */
  const isOpen = ref(false)
  const searchTerm = ref('')
  const numberOfSearchResults = ref(0)

  return {
    isOpen,
    searchTerm,
    numberOfSearchResults,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useModalStore, import.meta.hot))
