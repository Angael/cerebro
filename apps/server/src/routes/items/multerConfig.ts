import fs from 'fs-extra';
import { extname } from 'path';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { MAX_UPLOAD_SIZE, UPLOADS_DIR } from '@/utils/consts.js';

fs.mkdirs(UPLOADS_DIR);

// Get rid of this, uploads will not be used after this
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, nanoid() + extname(file.originalname)); //Appending extension
  },
});

const limits = {
  fileSize: MAX_UPLOAD_SIZE, // 10mb
};

export const multerOptions = { storage, limits };
