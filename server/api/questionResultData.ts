import type { IncomingMessage, ServerResponse } from 'h3'
import { useQuery } from 'h3'
import type { CollectionReference } from 'firebase/firestore'
import { collection, getDocs, query, where } from '@firebase/firestore'
import type { QuestionResult } from '../../types'
import db from '../lib/firestore'

export default async(req: IncomingMessage, _res: ServerResponse) => {
  const { evaluationId } = useQuery(req)
  const collectionRef = collection(db, 'questionResults') as CollectionReference<QuestionResult>
  const myQuery = query(collectionRef, where('evaluationId', '==', evaluationId))
  const querySnapshot = await getDocs(myQuery)
  return querySnapshot.docs.map(doc => doc.data())
}
