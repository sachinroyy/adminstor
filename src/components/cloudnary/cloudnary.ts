import { v2 as cloudinary } from 'cloudinary';

// Configuration
const cloudinaryConfig = {
  cloud_name: 'dhaumphvl',
  api_key: '223977999232774',
  api_secret: 'A386eCIQlD5V_XxCERgSzUGwdb4',
  secure: true
};

// Initialize Cloudinary
cloudinary.config(cloudinaryConfig);

// Verify configuration
console.log('Cloudinary configured with cloud name:', cloudinaryConfig.cloud_name);

// Handle image uploads
export const uploadImage = async (imageData: string) => {
  try {
    const result = await cloudinary.uploader.upload(imageData, {
      folder: 'deals',
      upload_preset: 'ml_default',
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export default cloudinary;

//  CLOUDINARY_URL=cloudinary://223977999232774:A386eCIQlD5V_XxCERgSzUGwdb4@dhaumphvl