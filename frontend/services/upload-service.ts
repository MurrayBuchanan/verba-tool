import axios from 'axios';

// TODO: Change user id to authenticated oid's

export async function uploadRecording(audioUri: string) {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

  if (!API_URL || !API_TOKEN) {
    throw new Error('Upload error: Environment variables must be set');
  }

  const formData = new FormData();
  formData.append('file', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'conversation-recording.m4a',
  } as any);

  try {
    // Ensure no trailing slash in API_URL
    const endpoint = API_URL.replace(/\/$/, '') + '/upload-audio';
    const response = await axios.post(endpoint, formData, {
      timeout: 1000 * 60 * 10, // Response can take up to 10 minutes
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'multipart/form-data',
        'User-ID': '1',
      },
    });
    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Upload failed: ', error.response?.data || error.message);
    throw error;
  }
}