'use strict'
const secrets = require('secrets.js-grempe')
const crypto = require('crypto')


module.exports =
class floSecretEncrypt {
    makeShares(numberOfKeys, numberOfKeysRequired) {
        const key = secrets.random(4096)
        this.key = key
        const shares = secrets.share(key, numberOfKeys, numberOfKeysRequired)
        return shares
    }

    encrypt(msg) {
        const cipher = crypto.createCipher('aes256', this.key)
        let encrypted = cipher.update(msg, 'utf8', 'base64')
        encrypted += cipher.final('base64')

        return encrypted
    }

}

