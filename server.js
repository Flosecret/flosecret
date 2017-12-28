const express = require('express')
const reqt = require('request')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')

const WalletOperations = require('./src/walletOperations')
const makePdf = require('./src/makePdf')

const username = process.env.FLOWALLET_USERNAME
const password = process.env.FLOWALLET_PASSWORD
const address1 = process.env.FLOWALLET_ADDRESS1
const address2 = process.env.FLOWALLET_ADDRESS2

const pdfFolder = path.resolve(__dirname, 'scratch')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT || 3000

app.use(express.static(__dirname))
// app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'pug')

app.get('/', (request, respond) => {
    respond.render('index')
})

const wallet = new WalletOperations(username, password, address1, address2)
wallet.init()

app.get('/get', (request, respond) => {
    let tx = request.param('tx')
    const numShares = parseInt(request.param('ns'))
    if (tx) {
        tx = tx.replace(/\s/g,'')
        const url = `https://florincoin.info/api/getrawtransaction?txid=${tx}&decrypt=1`
        reqt({url, encoding: null}, (err, response, body) => {
            const txInfo = JSON.parse(body.toString())
            const secret = txInfo['tx-comment'].split(':')[1]
            respond.render('getInfo', {
                tx,
                secret,
                ns: numShares
            })
        })
    }
    else {
        respond.render('getInfo')
    }
})

app.get('/post', (request, respond) => {
    respond.render('insertInfo')
})

app.get('/process', (request, respond) => {
    console.log('Got the request ro place info to the FLO blockchain')
    const decoded = decodeURIComponent(request.param('msg'))
    console.log(`Raw secret received is ${decoded}`)
    const msg = `SharedSecret1.0v-beta:${decoded}`
    wallet.pushToBlockChain(msg).then((tx) => {
        respond.send(tx)
    })
})

app.listen(port, () => {
    console.log(`Serving on port: ${port}`)
})