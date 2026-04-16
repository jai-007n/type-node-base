const config = require('config');
const key = config.get('HMAC_KEY')
const crypto = require("crypto-js");
const checkoutKey=config.get('CHECKOUT_HMAC_KEY')

module.exports = class Hmac {
    static generateHmacHash(payload) {
        return crypto.HmacSHA256(payload, key).toString(crypto.enc.Hex)
    }

    static verifyHmacHash(clientSide = '', serverSide = '') {
        return (clientSide === serverSide);
    }

    static generateHmacHashCheckout(payload) {
        return crypto.HmacSHA256(payload, checkoutKey).toString(crypto.enc.Hex)
    }

}