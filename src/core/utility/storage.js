const fs = require("fs");

class BaseStoarge {
    constructor(storePath = 'storage/images') {
        this.storePath =storePath
    };
};

    module.exports.LocalStorage = class LocalStorage extends BaseStoarge {
    
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
    
    };


