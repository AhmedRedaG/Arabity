import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseUUIDPipe,
  UploadedFiles,
  ParseFilePipe,
  Delete,
  Body,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorator/user.decorator';
import { RoleGuard } from 'src/guard/role.guard';
import { Role } from 'src/decorator/role.decorator';
import { UserRole } from '../user/entities/user.entity';
import {
  multerUploadImageOptions,
  validateUploadImagePipList,
} from 'src/config/app/multer.config';
import { DeleteImageDto } from './dto/delete-image.dto';

@UseGuards(AuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('profile-image')
  @UseInterceptors(FileInterceptor('image', multerUploadImageOptions))
  uploadProfileImage(
    @UploadedFile(new ParseFilePipe({ validators: validateUploadImagePipList }))
    image: Express.Multer.File,
    @User('sub') userId: string,
  ) {
    return this.uploadService.uploadProfileImage(userId, image);
  }

  @Delete('profile-image')
  deleteProfileImage(@User('sub') userId: string) {
    return this.uploadService.deleteProfileImage(userId);
  }

  @Post('service-image/:serviceId')
  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerUploadImageOptions))
  uploadServiceImage(
    @UploadedFile(new ParseFilePipe({ validators: validateUploadImagePipList }))
    image: Express.Multer.File,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ) {
    return this.uploadService.uploadServiceImage(serviceId, image);
  }

  @Delete('service-image/:serviceId')
  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  deleteServiceImage(@Param('serviceId', ParseUUIDPipe) serviceId: string) {
    return this.uploadService.deleteServiceImage(serviceId);
  }

  // @Post('component-images/:componentId')
  // @Role(UserRole.ADMIN)
  // @UseGuards(RoleGuard)
  // @UseInterceptors(FilesInterceptor('images', 5, multerUploadImageOptions))
  // uploadComponentImages(
  //   @UploadedFiles(
  //     new ParseFilePipe({ validators: validateUploadImagePipList }),
  //   )
  //   images: Express.Multer.File[],
  //   @Param('serviceId', ParseUUIDPipe) serviceId: string,
  // ) {
  //   return this.uploadService.uploadComponentImages(serviceId, images);
  // }
}
