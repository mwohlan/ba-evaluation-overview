export const useFetchPdf = (url: string) => {
  const link = ref('')
  const pdfLoading = ref(true)
  const startFetch = async () => {
    const data = await $fetch<string>('/api/pdfService')
    const byteCharacters = window.atob(data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++)
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    const byteArray = new Uint8Array(byteNumbers)
    const file = new Blob([byteArray], { type: 'application/pdf' })
    const fileURL = URL.createObjectURL(file)
    link.value = fileURL
    pdfLoading.value = false
  }
  return {
    link,
    pdfLoading,
    startFetch,
  }
}
