import type { Firestore } from '@firebase/firestore'

export default function(): Firestore {
  return useNuxtApp().$db
}
