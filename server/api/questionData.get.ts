import type { CollectionReference } from 'firebase/firestore'
import { collection, getDocs, query, where } from '@firebase/firestore'
import type { Question } from '../../types'
import db from '../lib/firestore'

export default defineEventHandler(async (event) => {
  const { evaluationId, questionId } = getQuery(event)
  const collectionRef = collection(db, 'questions') as CollectionReference<Question>
  const myQuery = query(collectionRef, where('evaluationId', '==', evaluationId), where('id', '==', +questionId))
  const querySnapshot = await getDocs(myQuery)
  return querySnapshot.docs[0].data()
})
