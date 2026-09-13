import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Attach JWT token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('companyconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 unauthorized errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't auto-redirect if checking auth or on login page
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/register') && !path.includes('/verify-otp')) {
        console.warn('Authentication expired or unauthorized');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Spring Boot `@RequestPart` expects multipart/form-data where:
 * - The JSON object is a Blob part with type 'application/json'
 * - The file is a file part
 */
export function buildMultipartPayload(jsonPartName: string, jsonData: object, file?: File | null): FormData {
  const formData = new FormData();
  const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
  // Explicit filename ensures mobile WebKit / Safari & Android Chrome preserve Content-Type: application/json
  formData.append(jsonPartName, jsonBlob, `${jsonPartName}.json`);

  if (file) {
    formData.append('file', file, file.name || 'upload.jpg');
  }

  return formData;
}
