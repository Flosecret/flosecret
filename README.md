# FLO Shared Secret

This app allows you to encrypt, store, and decode a secret on the FLO Blockchain. 

In cryptographic terms, a "shared secret" is a secure piece of data known only to a trusted group of individuals. The secret can be a password, a passphrase, a large number, or a collection of randomly chosen bytes. The secret is encrypted by splitting it into a set number of keyshares ("n") that can distributed to a group of keyholders ("m"). The keyholders can then recombine the keyshares to decrypt the secret.

Built using Shamir's Secret Sharing algorithm, this app stores the encrypted secret on the FLO Blockchain and splits it into keyshares which can be distributed and recombined to decrypt the secret. The secret can be as large as 1040 bytes. Once stored to the FLO Blockchain, the secret cannot be altered and it is accessible from anywhere.

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

### This is a zero-knowledge application.

This is a zero-knowledge application. The encryption of the Secret, and the creation of the master key and keyshares, happens in the app. The app then writes the encrypted Secret to the FLO Blockchain and generates pdfs with the FLO Blockchain transaction ID and individual keyshare codes.

### How do I encrypt a Secret?

Currently, the Secret must be typed into a text box that is limited to 1040 bytes. To start, click the “POST” button and select the number of keyshares to be generated and the number of keyshares required to decrypt the Secret. Next, enter the Secret you want to decrypt in the text box, and click “GO” button. The Secret will then be stored to the FLO Blockchain, and a pdf for each keyshare will be generated with a unique keyshare code and the FLO Blockchain transaction ID.

### How do I decrypt a Secret?

Click the “GET” box, enter required number of keyshares and FLO Blockchain transaction ID, and click “FIND SECRET.” Insert each unique keyshare code (found in the pdfs that were generated when the Secret was encrypted) and click “Decrypt.” If all of the information is entered correctly, the Secret will be displayed.

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
