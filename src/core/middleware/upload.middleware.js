const util = require("util");
const multer = require("multer");
const maxSize = 5 * 1024 * 1024;
let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/cleaners/');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);

    },
});


let uploadFile = multer({
    storage: storage,
    limits: {fileSize: maxSize},
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new multer.MulterError('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).single("profile_pic");
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware
