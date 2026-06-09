import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads a file to Firebase Storage (Google Cloud Storage container)
 * @param path The destination path in the bucket (e.g. 'avatars/user123.png')
 * @param file The File object from an input element
 * @returns The public download URL of the uploaded file
 */
export async function uploadFile(path: string, file: File): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

/**
 * Retrieves the download URL for a file in Storage
 * @param path The path of the file
 */
export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
}

/**
 * Deletes a file from Storage
 * @param path The path of the file
 */
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
