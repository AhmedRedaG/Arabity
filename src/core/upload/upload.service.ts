import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ServiceService } from '../service/service.service';
import { ComponentService } from '../component/component.service';
import { CloudinaryUploadService } from '../cloudinary-upload/cloudinary-upload.service';
import {
  ImageCategory,
  UploadedImageMainDetails,
} from 'src/types/upload.types';

@Injectable()
export class UploadService {
  constructor(
    private userService: UserService,
    private serviceService: ServiceService,
    private componentService: ComponentService,
    private cloudinaryUploadService: CloudinaryUploadService,
  ) {}

  async uploadProfileImage(userId: string, image: Express.Multer.File) {
    try {
      const newImage = await this.cloudinaryUploadService.uploadImage(
        image,
        ImageCategory.PROFILE,
      );

      const imageMainData: UploadedImageMainDetails = {
        url: newImage.secure_url,
        publicId: newImage.public_id,
      };

      const result = await this.userService.saveOrUpdateImage(
        userId,
        imageMainData,
      );

      if (result.oldImage) {
        this.cloudinaryUploadService
          .deleteImage(result.oldImage.publicId)
          .catch((err) =>
            console.error(
              `failed to delete old image ${result.oldImage?.publicId} :`,
              err,
            ),
          );
      }

      return {
        message: 'image saved successfully',
        image: imageMainData,
      };
    } catch (error) {
      if (error.http_code) {
        throw new BadRequestException('failed to upload image to storage');
      }
      throw error;
    }
  }

  async deleteProfileImage(userId: string) {
    try {
      const result = await this.userService.removeImage(userId);
      await this.cloudinaryUploadService.deleteImage(result.oldImage.publicId);
      return { message: 'image deleted successfully' };
    } catch (error) {
      if (error.http_code) {
        throw new BadRequestException('failed to delete image from storage');
      }
      throw error;
    }
  }

  async uploadServiceImage(serviceId: string, image: Express.Multer.File) {
    try {
      const newImage = await this.cloudinaryUploadService.uploadImage(
        image,
        ImageCategory.SERVICE,
      );

      const imageMainData: UploadedImageMainDetails = {
        url: newImage.secure_url,
        publicId: newImage.public_id,
      };

      const result = await this.serviceService.saveOrUpdateImage(
        serviceId,
        imageMainData,
      );

      if (result.oldImage) {
        this.cloudinaryUploadService
          .deleteImage(result.oldImage.publicId)
          .catch((err) =>
            console.error(
              `failed to delete old image ${result.oldImage?.publicId} :`,
              err,
            ),
          );
      }

      return {
        message: 'image saved successfully',
        image: imageMainData,
      };
    } catch (error) {
      if (error.http_code) {
        throw new BadRequestException('failed to upload image to storage');
      }
      throw error;
    }
  }

  async deleteServiceImage(serviceId: string) {
    try {
      const result = await this.serviceService.removeImage(serviceId);
      await this.cloudinaryUploadService.deleteImage(result.oldImage.publicId);
      return { message: 'image deleted successfully' };
    } catch (error) {
      if (error.http_code) {
        throw new BadRequestException('failed to delete image from storage');
      }
      throw error;
    }
  }

  // uploadComponentImages(componentId: string, images: Express.Multer.File[]) {
  // }
}
