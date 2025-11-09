import {
  BadRequestException,
  FileTypeValidator,
  FileValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';
import variablesConfig from './variables.config';

const { maxImageSize, allowedImageTypes } = variablesConfig().upload;
const allowedImageTypesRegex = new RegExp(
  `image/(${allowedImageTypes.join('|')})`,
);

export const validateUploadImagePipList: FileValidator<
  Record<string, any>,
  IFile
>[] = [
  new MaxFileSizeValidator({ maxSize: maxImageSize }),
  new FileTypeValidator({ fileType: allowedImageTypesRegex }),
];

export const multerUploadImageOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: maxImageSize,
  },
  fileFilter: (req, file, cb) => {
    if (allowedImageTypesRegex.test(file.mimetype)) cb(null, true);
    else
      cb(
        new BadRequestException(
          `only ${allowedImageTypes.join(', ')} images are allowed`,
        ),
        false,
      );
  },
};
