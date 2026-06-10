/**
 * Firebase Cloud Storage utilities for file upload, retrieval, and deletion.
 * @module lib/storage
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads a file to Firebase Cloud Storage and returns its public download URL.
 *
 * @param path - Destination path in the storage bucket (e.g. 'avatars/user123.png')
 * @param file - The File object from a file input element
 * @returns The publicly accessible download URL of the uploaded file
 */
export async function uploadFile(path: string, file: File): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

/**
 * Retrieves the public download URL for an existing file in storage.
 *
 * @param path - The storage path of the file
 * @returns The download URL
 */
export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
}

/**
 * Permanently deletes a file from Cloud Storage.
 *
 * @param path - The storage path of the file to delete
 */
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
