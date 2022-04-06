import { initializeApp } from '@firebase/app'
import type { Firestore } from '@firebase/firestore'
import { getFirestore } from '@firebase/firestore'

export default function(): Firestore {
  const nuxtApp = useNuxtApp()
  if (!nuxtApp._db) {
    const config = useRuntimeConfig()
    initializeApp({
      apiKey: config.API_KEY,
      authDomain: config.AUTH_DOMAIN,
      projectId: config.PROJECT_ID,
      storageBucket: config.STORAGE_BUCKET,
      messagingSenderId: config.MESSAGING_SENDER_ID,
      appId: config.APP_ID,
    })
    nuxtApp._db = getFirestore()
  }
  return nuxtApp._db
}
