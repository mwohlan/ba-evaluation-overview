import type { CollectionReference } from 'firebase/firestore'
import { collection, getDocs, query, where } from '@firebase/firestore'
import type { QuestionResult } from '../../types'
import db from '../lib/firestore'

export default defineEventHandler(async (event) => {
  const { evaluationId } = getQuery(event)
  const collectionRef = collection(db, 'questionResults') as CollectionReference<QuestionResult>
  const myQuery = query(collectionRef, where('evaluationId', '==', evaluationId))
  const querySnapshot = await getDocs(myQuery)
  return querySnapshot.docs.map(doc => doc.data())
})
