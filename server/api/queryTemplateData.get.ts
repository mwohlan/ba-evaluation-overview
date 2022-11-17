
import type { CollectionReference } from 'firebase/firestore'
import { collection, getDocs, query, where } from '@firebase/firestore'
import type { QueryTemplate } from '../../types'
import db from '../lib/firestore'

export default defineEventHandler(async (event) => {
  const { evaluationId, questionId } = getQuery(event)
  const collectionRef = collection(db, 'queryTemplates') as CollectionReference<QueryTemplate>
  const myQuery = query(collectionRef, where('evaluationId', '==', evaluationId), where('questionId', '==', +questionId))
  const querySnapshot = await getDocs(myQuery)
  return querySnapshot.docs.map(doc => doc.data())
})
