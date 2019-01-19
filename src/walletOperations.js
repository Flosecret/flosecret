'use strict'

const HDMW = require('oip-hdmw')
const Wallet = HDMW.Wallet
const defaultValue = 0.001

module.exports =
class SharedSecretWallet {
	constructor(mnemonics) {
		this.mnemonics = mnemonics
		this.wallet = new Wallet(this.mnemonics, {
			supported_coins: ['flo']
		})
		this.address = this.wallet.getCoin('flo').getMainAddress().getPublicAddress()
	}
	pushToBlockChain(floData, execute = true) {
		const to = {}
		to[this.address] = defaultValue
		return this.wallet.sendPayment({
			to,
			floData
		})
		.then((txid) => {
			console.log(`It worked out great, ${txid}`)
			return txid
		})
		.catch((err) => {
			console.log(err)
			throw Error(err)
		})
	}
	getBalances() {
		return this.wallet.getCoinBalances({
			discover: true
		}).then((bal) => {
			return bal.flo
		})
	}
}
