import {
  BadRequestException,
  FileTypeValidator,
  FileValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import fs from 'fs';
import variablesConfig from './variables.config';

const { maxImageSize, allowedImageTypes, uploadDir } = variablesConfig().upload;
const allowedImageTypesRegex = new RegExp(
  `image/(${allowedImageTypes.join('|')})`,
);

try {
  fs.mkdirSync(uploadDir, { recursive: true });
} catch (err) {
  console.error(err.message);
}

export const validateUploadImagePipList: FileValidator<
  Record<string, any>,
  IFile
>[] = [
  new MaxFileSizeValidator({ maxSize: maxImageSize }),
  new FileTypeValidator({
    fileType: allowedImageTypesRegex,
  }),
];

export const multerUploadImageOptions: MulterOptions = {
  storage: diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname);
      cb(null, `${uniqueSuffix}${extension}`);
    },
  }),
  limits: {
    fileSize: maxImageSize,
  },
  fileFilter: (req, file, cb) => {
    if (allowedImageTypesRegex.test(file.mimetype)) cb(null, true);
    else cb(new BadRequestException('only images are allowed'), false);
  },
};
