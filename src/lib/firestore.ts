import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, limit, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';

export async function createDocument<T extends DocumentData>(collectionPath: string, docId: string, data: T) {
  const docRef = doc(db, collectionPath, docId);
  await setDoc(docRef, data);
  return docRef;
}

export async function getDocument<T extends DocumentData>(collectionPath: string, docId: string) {
  const docRef = doc(db, collectionPath, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as unknown as T;
  }
  return null;
}

export async function updateDocument<T extends Partial<DocumentData>>(collectionPath: string, docId: string, data: T) {
  const docRef = doc(db, collectionPath, docId);
  await updateDoc(docRef, data);
  return docRef;
}

export async function deleteDocument(collectionPath: string, docId: string) {
  const docRef = doc(db, collectionPath, docId);
  await deleteDoc(docRef);
}

export async function queryDocuments<T extends DocumentData>(collectionPath: string, orderByField: string = 'timestamp', maxResults: number = 200) {
  const q = query(
    collection(db, collectionPath),
    orderBy(orderByField, 'desc'),
    limit(maxResults)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }) as unknown as T);
}
