import type { IncomingMessage, ServerResponse } from 'h3'
import { useQuery } from 'h3'
import type { CollectionReference } from 'firebase/firestore'
import { collection, getDocs, query, where } from '@firebase/firestore'
import type { QueryTemplate } from '../../types'
import db from '../lib/firestore'

export default async(req: IncomingMessage, _res: ServerResponse) => {
  const { evaluationId, questionId } = useQuery(req)
  const collectionRef = collection(db, 'queryTemplates') as CollectionReference<QueryTemplate>
  const myQuery = query(collectionRef, where('evaluationId', '==', evaluationId), where('questionId', '==', +questionId))
  const querySnapshot = await getDocs(myQuery)
  return querySnapshot.docs.map(doc => doc.data())
}
