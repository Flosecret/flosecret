'use strict'

const FloSecretEncrypt = require('./floSecretEncrypt')
const FloSecretDecrypt = require('./floSecretDecrypt')
const makePdf = require('./makePdf')

const http = require('http')
const path = require('path')

const floSecretEncrypt = new FloSecretEncrypt

const httpOptions = {
	method: 'GET',
    path: '/process',
    hostname: 'localhost',
    port: 5000,
    headers: {
		'Content-Type': 'application/json'
	}
}

window.decrypt = (ns) => {
    const shares = []
    const domShares = document.getElementsByClassName('input-share')
    for (let i = 0; i < domShares.length; i++) {
        const share = domShares[i].value.replace(/\s/g,'')
        shares.push(share)
    }
    const floSecretDecrypt = new FloSecretDecrypt(shares)
    floSecretDecrypt.recoverSecret(shares)
    const secretDOM = document.getElementById('secret')
    const secret = secretDOM.innerHTML
    const decrypted = floSecretDecrypt.dencrypt(secret)
    secretDOM.innerHTML = decrypted
    secretDOM.style.color = 'green'
}

window.getTxInfo = () => {
    const numberOfKeysRequired = parseInt(document.getElementById('nKr').value)
    const tx = document.getElementById('tx').value
    const url = `/get?tx=${tx}&ns=${numberOfKeysRequired}`
    let element = document.createElement('a')
    element.setAttribute('href', url)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}


window.postSecret = () => {
    const element = document.createElement('div')
    element.classList.add('log', 'row', 'justify-content-md-center')
    const message = document.createElement('p')
    message.classList.add('log-message')
    message.innerHTML = 'Please wait while your browser encrypt the information and send the secret to the FLO Blockchain.'
    element.appendChild(message)
    document.body.appendChild(element)
    const numberOfKeys = parseInt(document.getElementById('nK').value)
    const numberOfKeysRequired = parseInt(document.getElementById('nKr').value)
    const msg = document.getElementById('msg').value
    const shares = floSecretEncrypt.makeShares(numberOfKeys, numberOfKeysRequired)
    const encrypted = floSecretEncrypt.encrypt(msg)
    console.log(`encrypted secret: ${encrypted}`)
    const encoded = encodeURIComponent(encrypted)
    httpOptions.path += `?msg=${encoded}`
    const req = http.request(httpOptions, (res) => {
        let tx = ''
        res.on('data', (data) => {
            console.log('data received by function')
            tx += data.toString()
        })
        res.on('error', (err) => {
            console.log(err)
        })
        res.on('end', () => {
            message.innerHTML = 'Everything worked out, your secret is already in the FLO blockchain. Now you just have to wait a bit while your browser splits the secret and generates the pdf files with information about each share. Please allow download of multiple files when asked.'

            makePdf(shares, tx, numberOfKeysRequired).then(() => {
                message.innerHTML = 'Shares generated successfull. We are all set for now. Check your the info in the pdfs for instructions on how to recover the secret.'
            })
        })
    })
    req.end()
}
