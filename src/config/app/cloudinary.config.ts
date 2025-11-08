import { v2 as cloudinary, ConfigOptions, UploadApiOptions } from 'cloudinary';
import variablesConfig from 'src/config/app/variables.config';

const { allowedImageTypes } = variablesConfig().upload;

export const cloudinaryImageUploadOptions = (
  imageCategory: string = 'general',
): UploadApiOptions => {
  return {
    resource_type: 'image',
    folder: `arabity/images/${imageCategory}`,
    quality: 'auto',
    fetch_format: 'auto',
    use_filename: true,
    unique_filename: false,
    allowed_formats: allowedImageTypes,
    timeout: 1000 * 60 * 10, // 10 minutes
    overwrite: true,
    invalidate: true,
  };
};

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error('cloudinary environment variables are missing');
}

const cloudinaryConfig: ConfigOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(cloudinaryConfig);

export default cloudinary;
