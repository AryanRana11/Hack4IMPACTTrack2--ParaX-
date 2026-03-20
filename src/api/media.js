import { apiPost } from './client';
// Use legacy import to support uploadAsync on SDK 54
import { uploadAsync, FileSystemUploadType } from 'expo-file-system/legacy';

export async function getPresignedUrl({ contentType, prefix = 'complaints/' }) {
  return apiPost('/api/v1/media/presign', { contentType, prefix });
}

export async function uploadToPresignedUrl({ uploadUrl, fileUri, contentType }) {
  // Some environments may not expose FileSystemUploadType; default to binary upload without the flag
  const options = {
    httpMethod: 'PUT',
    headers: { 'Content-Type': contentType },
  };
  if (typeof FileSystemUploadType !== 'undefined' && FileSystemUploadType.BINARY_CONTENT) {
    options.uploadType = FileSystemUploadType.BINARY_CONTENT;
  }
  const res = await uploadAsync(uploadUrl, fileUri, options);
  if (res.status !== 200) {
    throw new Error(`Upload failed: ${res.status}`);
  }
  return true;
}
