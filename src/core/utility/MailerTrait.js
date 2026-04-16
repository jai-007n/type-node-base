const AWS = require('aws-sdk');
const config = require('config');
let accessKey = config.get('AWS_ACCESS_KEY_ID_MAIL')
let secretKey = config.get('AWS_SECRET_ACCESS_KEY_MAIL')
const jwt = require('jsonwebtoken');
const moment = require('moment');
const SES_CONFIG = {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    region: 'us-east-1',
    signatureVersion: 'v4'
};
AWS.config.update(SES_CONFIG)

module.exports = class MailerTrait {
    constructor(environment, dbConfig) {
        this.environment = environment;
        this.dbConfig = dbConfig;
    }

    static async sendWelcomeMail(user, role, password) {
        let imageUrlLogo = config.get('ADMIN_PUBLIC_URL')
        let webLink = config.get('WEB_URL')
        let userName = 'N/A'
        if (role === 'Member') {
            userName = user.name
        } else {
            userName = user.fullName
        }

        let params = {
            Source: 'support@myrighth.com',
            Template: 'WELCOME_MAIL',
            Destination: {
                ToAddresses: [
                    `${user.email}`
                ],
            },
            TemplateData: "{ \"name\":\"" + userName + "\",\"webLink\":\"" + webLink + "\",\"imageUrlLogo\":\"" + imageUrlLogo + "\"," +
                "\"userName\":\"" + user.email + "\",\"password\":\"" + password + "\",\"role\":\"" + role + "\"}"
        };

        let sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendTemplatedEmail(params).promise();

        await sendPromise.then(
            function (data) {
                console.log(data.MessageId, " Message Sent Successfully");
            }).catch(
            function (err) {
                console.error(err, err.stack);
            });
    }
}