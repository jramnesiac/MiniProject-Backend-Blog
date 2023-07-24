import multer from 'multer';
import fs from 'fs';

const multerUpload = (directory, name) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, directory);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = name + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = file.originalname.split('.').pop();
      cb(null, uniqueSuffix + '.' + fileExtension);
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = file.originalname.toLowerCase().split('.').pop();

    if (allowedExtensions.includes('.' + fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('File Extension is not allowed'));
    }
  };

  const fileSizeLimit = 1024 * 1024;
  return multer({ storage, fileFilter, limits: { fileSize: fileSizeLimit }, preservePath: true });
};

export default multerUpload;
