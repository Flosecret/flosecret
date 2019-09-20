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
    //secretDOM.setAttribute('word-break', 'break-word')
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
    if (document.getElementById('log'))
        document.body.removeChild(document.getElementById('log'))
    const element = document.createElement('div')
    element.classList.add('row', 'justify-content-md-center')
    element.id = 'log'
    const message = document.createElement('p')
    message.classList.add('log-message')
    message.innerHTML = 'Please wait while your browser encrypts the information and sends your Secret to the FLO Blockchain.'
    element.appendChild(message)
    document.body.appendChild(element)
    const numberOfKeys = parseInt(document.getElementById('nK').value)
    const numberOfKeysRequired = parseInt(document.getElementById('nKr').value)
    let allGood = false
    if (Number.isInteger(numberOfKeys) && Number.isInteger(numberOfKeysRequired)) {
        if (numberOfKeysRequired >= 2 && numberOfKeys >= numberOfKeysRequired) 
            allGood = true
    }
    const msg = document.getElementById('msg').value
    if (allGood){
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
                console.log('Ooops')
                console.log(err)
                message.innerHTML = 'Something went wrong'
            })
            res.on('end', () => {
                message.innerHTML = 'Congratulations! Your Secret is now saved to the FLO Blockchain. Now you just have to wait a bit while your browser splits the secret into sharekeys and generates multiple pdf files with code (hash) for each keyshare. Please allow multiple pdf files to download when prompted.'

                makePdf(shares, tx, numberOfKeysRequired).then(() => {
                    message.innerHTML = 'The keyshares were generated successfully! Review the pdfs for instructions on how to recover your Secret.'
                })
            })
        })
        req.end()
    }
    else {
        message.innerHTML = 'ERROR: Something went wrong. One of these requirements were not met: 1) The number of total keyshares and required keyshares must be numbers (integers), 2) the total number of keyshares must be equal to or greater than the number of required keyshares.'
        const moveOnButton = document.createElement('button')
        moveOnButton.classList.add('btn', 'btn-primary-outline', 'front-btn')
        moveOnButton.addEventListener('click', () => {
            document.body.removeChild(element)
        })
        moveOnButton.innerHTML = 'Ok, got it!'
        element.appendChild(moveOnButton)
    }

}
