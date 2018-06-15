# flosecret

This app lets you save encrypted secret in the FLO blockchain and produces a number of keys that must be combined to be able to decrypt the secret.

## Install

Clone the repository and navigate into the project directory. Then,

```
npm install
```

Make an environment `.env` file with the credentials of your flovault account and two addresses, similar to the Flotorizer install process. Then,

```
npm run browserify
npm start
```

To test the style/UI locally,

```
npm install 
npm start 
```
and you should be good to go!

## About

### This is a zero knowledge application.

The creation of the master key and shared keys and the encryption of the secret with the main key happens in your browser. SharedSecret then sends the encrypted information to be posted in the FLO blockchain. This is the only information sent to our servers. The server reply with the hash of the transaction and ask your browser to produce the pdf containing information about the shares.

### How to record an encrypted information?

Currently, we are only supporting messages typed or copied to a text area. Click in POST, select the number of total shares and the number of required shares, type or paste the information and click GO.

### How to decrypt a secret?

Click in GET, type the number of minimum required shares and the hash of the transaction and press Find secret. Then insert the hash of each share and click decrypt. If everything is ok, you should be able to see the decrypted information.

### What algorithms are used?

SharedSecret asks your browser to generate a random 4096-bit key using secrets.js-grempe module (an implementation of Shamir's threshold secret sharing scheme) and encrypt the message using aes-256 from the node crypto package.

### How can I help?

Pull request changes from the git repository https://github.com/Flosecret/flosecret

Donate FLO to: FDN6xPX3RgvWCjtXpBLQLsEgTiCkQduENR

Donate BTC to: 13scVVoHsYk6fgbXdSbSzAuCdSHSc26i7T

Donate LTC to: LTkCoGJxQY1KTHiVojRBzMcpc2imCFLcZJ

To donate in other coins, just let me know.
Any questions, suggestions or just wanna say "Hi"?

[Twitter][1]

[FLO telegram channel][2]

[Github][3]

[1]:https://twitter.com/flosharedsecret?lang=en
[2]:https://t.me/FLOblockchain
[3]:https://twitter.com/flosharedsecret
