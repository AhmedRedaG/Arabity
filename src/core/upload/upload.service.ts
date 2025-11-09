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
    const user = await this.userService.findOneBy({ id: userId });
    try {
      const newImage = await this.cloudinaryUploadService.uploadImage(
        image,
        ImageCategory.PROFILE,
      );

      const imageMainData: UploadedImageMainDetails = {
        url: newImage.secure_url,
        publicId: newImage.public_id,
      };

      await this.userService.saveOrUpdateImage(userId, imageMainData);

      if (user.image) {
        this.cloudinaryUploadService
          .deleteImage(user.image.publicId)
          .catch((err) =>
            console.error(
              `failed to delete old image ${user.image?.publicId} :`,
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
    const { oldImage } = await this.userService.removeImage(userId);
    try {
      await this.cloudinaryUploadService.deleteImage(oldImage.publicId);
      return { message: 'image deleted successfully' };
    } catch (error) {
      if (error.http_code) {
        console.error('failed to delete profile image from storage');
      }
      throw error;
    }
  }

  async uploadServiceImage(serviceId: string, image: Express.Multer.File) {
    const service = await this.serviceService.findOneBy({ id: serviceId });
    try {
      const newImage = await this.cloudinaryUploadService.uploadImage(
        image,
        ImageCategory.SERVICE,
      );

      const imageMainData: UploadedImageMainDetails = {
        url: newImage.secure_url,
        publicId: newImage.public_id,
      };

      await this.serviceService.saveOrUpdateImage(service.id, imageMainData);

      if (service.image) {
        this.cloudinaryUploadService
          .deleteImage(service.image.publicId)
          .catch((err) =>
            console.error(
              `failed to delete old image ${service.image?.publicId} :`,
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
    const result = await this.serviceService.removeImage(serviceId);
    try {
      await this.cloudinaryUploadService.deleteImage(result.oldImage.publicId);
      return { message: 'image deleted successfully' };
    } catch (error) {
      if (error.http_code) {
        console.error('failed to delete service image from storage');
      }
      throw error;
    }
  }

  async uploadComponentImages(
    componentId: string,
    images: Express.Multer.File[],
  ) {
    const component = await this.componentService.findOneBy({
      id: componentId,
    });
    if (component.images.length + images.length > 5) {
      throw new BadRequestException('can not add more than 5 images');
    }
    const totalImages = component.images;
    try {
      const newImages = await this.cloudinaryUploadService.uploadMultipleImages(
        images,
        ImageCategory.COMPONENT,
      );

      const newImagesMainData: UploadedImageMainDetails[] = newImages.map(
        (image) => ({
          url: image.secure_url,
          publicId: image.public_id,
        }),
      );

      totalImages.push(...newImagesMainData);

      await this.componentService.saveOrAddImages(componentId, totalImages);

      return {
        message: 'images saved successfully',
        images: totalImages,
      };
    } catch (error) {
      if (error.http_code) {
        throw new BadRequestException('failed to upload images to storage');
      }
      throw error;
    }
  }

  async deleteComponentImages(componentId: string, publicIds: string[]) {
    if (!publicIds.length) {
      throw new BadRequestException('no image ids provided for deletion');
    }
    await this.componentService.removeImages(componentId, publicIds);

    try {
      await this.cloudinaryUploadService.deleteMultipleImages(publicIds);
      return { message: 'images deleted successfully' };
    } catch (error) {
      if (error.http_code) {
        console.error('failed to delete component images from storage');
      }
      throw error;
    }
  }
}
