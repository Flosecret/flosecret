'use strict'
const secrets = require('secrets.js-grempe')
const crypto = require('crypto')


module.exports =
class floSecretDecrypt {
    constructor(shares) {
        this.shares = shares
    }

    recoverSecret() {
        this.key = secrets.combine(this.shares)
    }

    dencrypt(msg) {
        const decipher = crypto.createDecipher('aes256', this.key)
        let decrypted = decipher.update(msg, 'base64', 'utf8')
        decrypted += decipher.final('utf8')
        this.key = null
        return decrypted
    }

}

