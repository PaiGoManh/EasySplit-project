const multer = require('multer');
const path = require('path');

// Define storage for all file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profileBanner') {
      cb(null, 'uploads/');
    } else if (file.fieldname === 'profilePicture') {
      cb(null, 'uploads/');
    } else {
      cb(new Error('Unexpected field'), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (['profileBanner', 'profilePicture'].includes(file.fieldname)) {
      cb(null, true);
    } else {
      cb(new Error('Unexpected field'), false);
    }
  },
});

module.exports = {
  upload,
};
