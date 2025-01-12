const multer = require('multer');
const crypto = require('crypto');
const path  = require('path');

const generateFiles = (file) => {
    const hash = crypto.createHash('md5').update(file.originalname + Date.now()).digest('hex');
    return hash + path.extname(file.originalname);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.resolve(__dirname, '../public/uploads')),
    filename: (req, file, cb) => cb(null, generateFiles(file))
});

const upload = multer({ storage: storage });

module.exports = upload;
