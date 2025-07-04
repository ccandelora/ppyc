// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '183178768794612',
  // Note: API Secret should NEVER be exposed in frontend code
  // It's only used in the backend for secure operations
}; 