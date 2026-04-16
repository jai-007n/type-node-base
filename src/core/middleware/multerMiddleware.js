const multer = require('multer');
const multerMiddleware = (uploadS3) => {

    return (req, res, next) => {
        let msg = ''
        uploadS3(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        msg = ' Uploaded file size is greater than 8 mb.'
                    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                        msg = ' Maximum files allowed is 8.'
                    } else {
                        msg = err.message
                    }
                    return res.status(400).json({
                        status: false,
                        code: 400,
                        message: msg,
                    });
                } else if (err) {
                    return res.status(400).json({
                        status: false,
                        code: 400,
                        message: err.message,
                    });
                }
                // Everything went fine.
                next();
            }
        );

        uploadLocal();
    }


}

module.exports = multerMiddleware