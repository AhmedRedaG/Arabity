import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import cloudinary, {
  cloudinaryImageUploadOptions,
} from 'src/config/app/cloudinary.config';
import * as streamifier from 'streamifier';
import fs from 'fs/promises';

@Injectable()
export class CloudinaryUploadService {
  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const imageUploadOptions = cloudinaryImageUploadOptions(folder);
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        imageUploadOptions,
        (error, result) => {
          fs.unlink(file.path);
          if (error) return reject(error);
          if (result) return resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }

  async deleteMultipleImages(publicIds: string[]) {
    return cloudinary.api.delete_resources(publicIds);
  }

  getImageUrl(publicId: string, options?: any) {
    return cloudinary.url(publicId, options);
  }

  getThumbnail(
    publicId: string,
    width: number = 200,
    height: number = 200,
  ): string {
    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });
  }
}
