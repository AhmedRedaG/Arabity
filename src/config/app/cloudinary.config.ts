import { v2 as cloudinary } from 'cloudinary';

const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const CLOUDINARY_UPLOAD_TIMEOUT = 10 * 60 * 1000; // 10 minutes

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const imageUploadOptions = (imageCategory: string) => {
  return {
    resource_type: 'image',
    folder: `arabity/images/${imageCategory}`,
    quality: 'auto',
    fetch_format: 'auto',
    use_filename: true,
    unique_filename: false,
    allowed_formats: ALLOWED_IMAGE_TYPES,
    timeout: CLOUDINARY_UPLOAD_TIMEOUT,
    overwrite: true,
    invalidate: true,
  };
};

export default cloudinary;
