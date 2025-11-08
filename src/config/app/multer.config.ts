import {
  FileTypeValidator,
  FileValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import fs from 'fs';
import path from 'path';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

try {
  fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
} catch (err) {
  console.error(err.message);
}

export const validateUploadImagePipList: FileValidator<
  Record<string, any>,
  IFile
>[] = [
  new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE }),
  new FileTypeValidator({ fileType: 'image/*' }),
];

export const multerUploadImageOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix);
    },
  }),
  limits: {
    fileSize: MAX_IMAGE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(null, false);
  },
};
