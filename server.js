const express = require('express')
const reqt = require('request')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')

const HDMW = require('oip-hdmw')
const Wallet = HDMW.Wallet
const defaultValue = 0.01
const mnemonics = process.env.FLOWALLET_MNEMONICS
const wallet = new Wallet(mnemonics, {discover: true, supported_coins: ['flo']})
const coin = wallet.getCoin('flo')

coin.discoverAccounts().then((accounts) => {
    //console.log(accounts)
    const address = coin.getMainAddress().getPublicAddress()

    console.log(`FLO address is: ${address}`)
    const to = {}
    to[address] = defaultValue

    return coin.getAccount().sendPayment({
        from: address,
        to,
        floData: 'SharedSecret is about to do something... or not',
        coin: 'flo'
    })
}).then((txid) => {
    console.log('it worked')
}).catch((err) => {
    console.log('Something is not right')
    console.log(err)
})

 

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

app.get('/get', (request, respond) => {
    let tx = request.param('tx')
    const numShares = parseInt(request.param('ns'))
    if (tx) {
        tx = tx.replace(/\s/g,'')
        const url = `https://florincoin.info/api/getrawtransaction?txid=${tx}&decrypt=1`
        reqt({url, encoding: null}, (err, response, body) => {
            const txInfo = JSON.parse(body.toString())
            const rawSecret = txInfo['tx-comment'] || txInfo['floData']
            if (rawSecret) {
                const secret = rawSecret.split(':')[1]
                respond.render('getInfo', {
                    tx,
                    secret,
                    ns: numShares
                })
            }
            else {
                console.log(JSON.stringify(rawSecret, null, ' '))
            }
        })
    }
    else {
        respond.render('getInfo')
    }
})

app.get('/post', (request, respond) => {
    respond.render('insertInfo')
})

app.get('/process', (request, respond, next) => {
    console.log('Got the request to place info to the FLO blockchain')
    const decoded = decodeURIComponent(request.param('msg'))
    console.log(`Raw secret received is ${decoded}`)
    const msg = `SharedSecret1.0v-beta:${decoded}`
    const address = wallet.getCoin('flo').getMainAddress().getPublicAddress()

    console.log(`FLO address is: ${address}`)
    const to = {}
    to[address] = defaultValue
    wallet.sendPayment({
        to,
        floData: msg,
        coin: 'flo'
    }).then((txid) => {
        console.log('it worked')
        respond.send(txid)
    }).catch((err) => {
        console.log('Something went wrong')
        console.log(err)
        next(err)
    })
})

app.listen(port, () => {
    console.log(`Serving on port: ${port}`)
})