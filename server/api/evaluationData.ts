import type { IncomingMessage, ServerResponse } from 'http'
import type { CollectionReference } from 'firebase/firestore'
import { collection, getDocs } from '@firebase/firestore'
import type { Evaluation } from '../../types'
import db from '../lib/firestore'

export default async(_req: IncomingMessage, _res: ServerResponse) => {
  const collectionRef = collection(db, 'evaluations') as CollectionReference<Evaluation>
  const snapshot = await getDocs(collectionRef)
  return snapshot.docs.map(doc => doc.data())
}
