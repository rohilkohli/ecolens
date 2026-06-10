/**
 * Firestore CRUD wrapper providing typed document operations.
 * All functions use generic type parameters for compile-time safety.
 * @module lib/firestore
 */

import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, limit, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Creates or overwrites a document at the specified path.
 *
 * @typeParam T - The document data shape
 * @param collectionPath - Firestore collection path (e.g. 'users/uid/activities')
 * @param docId - Document identifier
 * @param data - Document data to persist
 * @returns The created document reference
 */
export async function createDocument<T extends DocumentData>(collectionPath: string, docId: string, data: T) {
  const docRef = doc(db, collectionPath, docId);
  await setDoc(docRef, data);
  return docRef;
}

/**
 * Retrieves a single document by path and ID.
 * Returns null if the document does not exist.
 *
 * @typeParam T - Expected document data shape
 * @param collectionPath - Firestore collection path
 * @param docId - Document identifier
 * @returns The typed document data with ID, or null if not found
 */
export async function getDocument<T extends DocumentData>(collectionPath: string, docId: string): Promise<T | null> {
  const docRef = doc(db, collectionPath, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as unknown as T;
  }
  return null;
}

/**
 * Partially updates an existing document's fields.
 *
 * @typeParam T - Partial document data shape
 * @param collectionPath - Firestore collection path
 * @param docId - Document identifier
 * @param data - Fields to update (merged with existing data)
 * @returns The updated document reference
 */
export async function updateDocument<T extends Partial<DocumentData>>(collectionPath: string, docId: string, data: T) {
  const docRef = doc(db, collectionPath, docId);
  await updateDoc(docRef, data);
  return docRef;
}

/**
 * Permanently deletes a document from Firestore.
 *
 * @param collectionPath - Firestore collection path
 * @param docId - Document identifier to delete
 */
export async function deleteDocument(collectionPath: string, docId: string): Promise<void> {
  const docRef = doc(db, collectionPath, docId);
  await deleteDoc(docRef);
}

/**
 * Queries documents in a collection with ordering and pagination.
 *
 * @typeParam T - Expected document data shape
 * @param collectionPath - Firestore collection path to query
 * @param orderByField - Field name to sort by (descending). Defaults to 'timestamp'.
 * @param maxResults - Maximum number of documents to return. Defaults to 200.
 * @returns Array of typed documents sorted by the specified field
 */
export async function queryDocuments<T extends DocumentData>(
  collectionPath: string,
  orderByField: string = 'timestamp',
  maxResults: number = 200
): Promise<T[]> {
  const q = query(
    collection(db, collectionPath),
    orderBy(orderByField, 'desc'),
    limit(maxResults)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }) as unknown as T);
}
