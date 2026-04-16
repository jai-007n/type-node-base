const config = require('config');
let accessKey = config.get('AWS_ACCESS_KEY_ID')
let secretKey = config.get('AWS_SECRET_ACCESS_KEY')
const AWS = require("aws-sdk");
const {S3Client} = require('@aws-sdk/client-s3')
const multer = require('multer');
const multerS3 = require("multer-s3");
const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
    },
    region: 'ap-south-1'
})
const imageMineTypes = ["image/jpeg", "image/png", "image/gif"];


module.exports = class MailerTrait {
    constructor(environment, dbConfig) {
        this.environment = environment;
        this.dbConfig = dbConfig;
    }

    static uploadS3Single(bucketPath, fileName, uploadType = 1, arrayCount = 3) {
        let uploadS3 = multer({
            storage: multerS3({
                s3: s3,
                bucket: 'positiive-image',
                acl: 'public-read',
                metadata: (req, file, cb) => {
                    cb(null, {fieldName: Date.now() + '-' + file.originalname});
                },
                key: (req, file, cb) => {
                    let fullPath = bucketPath + Date.now() + '-' + file.originalname;//If you want to save into a folder concat de name of the folder to the path
                    cb(null, fullPath)
                }
            }),
            limits: {fileSize: 8000000}, // In bytes: 2000000 bytes = 2 MB
            fileFilter: function (req, file, cb) {
                if (!imageMineTypes.includes(file.mimetype)) {
                    return cb(new Error('Wrong file type'));
                }
                cb(null, true)
            }
        });
        if (uploadType === 2) {
            uploadS3.fields(fileName)
        } else if (uploadType === 3) {
            uploadS3.array(fileName, arrayCount)
        } else {
            uploadS3.single(fileName);
        }
        return uploadS3;
    }
}