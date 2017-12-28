'use strict'

require('./SimpleWalletFlorincoin.js')

const path = require('path'),
	http = require('https')

module.exports =
class MyWallet {
	constructor(username, password, address1, address2) {
		this.username = username
		this.password = password
		this.addresses = [
			{
				hash: address1,
				val: 0
			},
			{
				hash: address2,
				val: 0
			}
		]
	}
	init() {
		this.wallet = new Promise((resolve, reject) => {
			let wallet = new Wallet(this.username, this.password)
			wallet.refreshBalances
			wallet.load(() => {
				console.log('wallet ready')
				this.getBalances().then((balances) => {
					this.balance = balances.reduce((a, b) => {
						return a.val + b.val
					})
					console.log(this.balance)
					let initial = 1.99052799
					let previous = 0
					this.flotorizations = previous + Math.floor((initial - this.balance) * 1000)
					console.log(this.flotorizations)
				})
				resolve(wallet)
			})
		})
	}

	pushToBlockChain(msg, execute = true) {
		return new Promise((res, rej) => {
			this.wallet.then((wallet) => {
				wallet.refreshBalances
				let transValue = 0.001
				let donor = 0,
					recepient = Math.floor(Math.random() * 2)
				if (donor === recepient) {
					console.log(donor + ' - ' + recepient)
					donor = 1
				}
				if (execute) {
					wallet.load(() => {
						console.log('This would be trigger a transaction between ' + this.addresses[donor].hash + ' and ' + this.addresses[recepient].hash)
						console.log('The total balance is: ' + this.balance)
						console.log('The message would be: ')
						console.log('msg')
						wallet.sendCoins(this.addresses[donor].hash, this.addresses[recepient].hash, transValue, msg, function(err, data) {
							if (err)
								rej('failed to send transaction')
							res(data.txid)
						})
					})
				}
				else {
					res('8004104227dc5f59c6e817dbcd4d192d21c31118b1e2225133d0d0022b9c61b6')
				}
			})
		})
	}

	getBalances() {
		return new Promise((res, rej) => {
			let answers = 0
			let self = this
			this.addresses.forEach(function(address, i) {
				let options = {
					hostname: 'florincoin.info',
					path: '/ext/getaddress/' + address.hash,
					method: 'GET'
				}
				let req = http.request(options, (response) => {

					let alldata = ''
					response.on('data', (d) => {
						alldata += d
					})

					response.on('end', () => {
						let val = JSON.parse(alldata).balance
						self.addresses[i].val = Math.abs(val)
						answers++
						console.log(address.hash + ' - ' + val)
						if (answers === 2)
							res(self.addresses)
					})
				})

				req.on('error', (e) => {
					console.error(e)
				})
				req.end()
			})
		})
	}
}
