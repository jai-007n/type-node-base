const fs = require("fs");
// const {Logger} = require('aws-cloudwatch-log')
const config = require('config');
// let accessKey = config.get('AWS_ACCESS_KEY_ID')
// let secretKey = config.get('AWS_SECRET_ACCESS_KEY')
// let logName = config.get('AWS_LOGS')
// const {createLogStream} = require('aws-cloudwatch-log')
// const moment = require('moment');
class BaseLogger {
    constructor(type = null) {
        this.msg = {
            type,
            timestamp: Date.now()
        }
    };

};

module.exports.LocalLogger = class LocalLogger extends BaseLogger {

    constructor(module = null, msg = null, code = 400) {
        super('local');
        this.msg.code = code;
        this.msg.messages = msg;
        this.msg.module = module;

        this.storeMessage();
    }


    storeMessage() {
        const directoryName = this.todayDirectoryName()
        this.checkDirectoryExist(directoryName);
        this.checkFileExist(directoryName);
        this.appendContent(directoryName,JSON.stringify(this.msg));
    }


    todayDirectoryName() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        return `storage/logs/${year}/${month}/${day}`;
    }

    checkDirectoryExist(directoryName) {
        try {
            if (!fs.existsSync(directoryName)) {
                fs.mkdirSync(directoryName, { mode: 0o766, recursive: true })
                return true;
            }
            return false;
        }
        catch (e) {
            return false;
        }
    }

    checkFileExist(directoryName) {
        try {
            if (!fs.existsSync(`${directoryName}/logs.txt`)) {
                fs.writeFileSync(`${directoryName}/logs.txt`,'');
                return true
            } return false;
        }
        catch (e) {
            return false;
        }
    }
    appendContent(directoryName,content) {
        try {
            fs.appendFileSync(`${directoryName}/logs.txt`, `################ NEW ERROR REPORTED ################## \n ${content}\n`);
            return true
        }
        catch (e) {
            return false;
        }
    }

};

// module.exports.AWSLogger = class AWSLogger extends BaseLogger {

//     constructor(module = null, msg = null, code = 400) {
//         super('Aws');
//         this.msg.code = code,
//             this.msg.messages = msg,
//             this.msg.module = module
//     }


//      static generateLogStream(payload) {
//         let dateFormatStream = moment(new Date()).format("YYYY-MM-DD-HH-mm")
//         const configParams = this.generateStreamData()
//         const logger = new Logger(configParams)
//         const config = {
//             logGroupName: `aws-logs-${logName}`,
//             region: 'ap-south-1',
//             accessKeyId: accessKey,
//             secretAccessKey: secretKey,
//             local: false 		// Optional. If set to true, no LogStream will be created.
//         }
       

//         return createLogStream(`rightHand-${dateFormatStream}`, config)
//             .then(data => {
//                 console.log('stream generated successfully')
//                 console.log(data, 123456)
//                 logger.log(payload)
//             })
//             .catch(err => {
//                 if (err.message === 'The specified log stream already exists') {
//                     logger.log(payload)
//                     // console.log('logs generated successfully')
//                 } else {
//                     console.log(err)
//                     logger.log(payload)
//                 }
//             })
//     }

//     static generateLogs(payload) {
//         return this.generateLogStream(payload)
//     }

//     static generateStreamData() {
//         let dateFormatStream = moment(new Date()).format("YYYY-MM-DD-HH-mm")
//         return {
//             logGroupName: `aws-logs-${logName}`,
//             logStreamName: `rightHand-${dateFormatStream}`,
//             region: 'ap-south-1',
//             accessKeyId: accessKey,
//             secretAccessKey: secretKey,
//             uploadFreq: 10000, 	// Optional. Send logs to AWS LogStream in batches after 10 seconds intervals.
//             local: false 		// Optional. If set to true, the log will fall back to the standard 'console.log'.
//         }
//     }

// };



// module.exports.LocalLogger =LocalLogger