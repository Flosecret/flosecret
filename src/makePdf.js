'use strict'

const PDFDocument = require('pdfkit')
const blobStream = require('blob-stream')
const FileSaver = require('file-saver')
const path = require('path')
const fs = require('fs')
const qr = require('qr-image')
const request = require('request')

module.exports = (shares, tx, nRequired, filename = false) => {
    let url = 'http://localhost:5000'
    if (!filename)
        url = window.location.origin
        
    return new Promise((resolve, reject) => {
        request({url: `${url}/assets/FLO_secret_share_logo.greyOnBlack.highres.png`, encoding: null}, (err, res, logo) => {

            if (err)
                console.log(err)
            
            const timeStamp = Date.now()
    
            shares.forEach((share, i) => {
                const doc = new PDFDocument({
                    autoFirstPage: false
                })
        
                doc.font('Courier')
                const mainTextWidht = 450
                console.log(`Share: ${i}`)
                doc.addPage({
                    margins: {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    }
                })
          
                doc.lineWidth(25)
                doc.lineJoin('miter')
                   .rect(0, 0, 612, 792)
                   .stroke("black")
                   .stroke()
    
                doc.image(logo, 20, 20, {width: 50})
    
                doc.fontSize(25)
                    
                doc.save()
                doc.translate(80, 30)
                    .text('SharedSecret 1.0', {
                        align: 'left' 
                    })
                
                doc.translate(0,-5)
                    .fontSize(10)
                    .text('Powered by the FLO Blockchain')
    
                doc.fontSize(12)
                    .moveDown(2)
                    .text('A secret has been encrypted and posted on the blockchain of the FLO cryptocurrency in the the following transaction:', {
                        align: 'justify',
                        width: mainTextWidht
                    })
                    .moveDown()
                
                doc.save()  
                doc.fontSize(10)
                    .translate(50, 0)
                    .moveDown(1)
                    .text(tx, {
                        link: `https://florincoin.info/tx/${tx}`,
                        align: 'center',
                        width: 100
                    })
                    .moveDown(1)
    
                let qrtx = qr.svgObject(`https://florincoin.info/tx/${tx}`)
                doc.translate(280, 97).scale(1.5)
                    .path(qrtx.path)
                    .fill('black', 'even-odd')
                    .stroke()
                    .restore()
    
                doc.fontSize(12)
                    .moveDown()
                    .text(`The key to decrypt this secret has been split in ${shares.length} shares like this one. By design, the secret can be decrypted with any ${nRequired} shares like this one.`, {
                        align: 'justify',
                        width: mainTextWidht
                    })
                    .moveDown()
                    .text(`Bellow is the part of the key that belongs to this share`, {
                        align: 'justify',
                        width: mainTextWidht
                    })
                    .moveDown()
    
                doc.save()
                const qrShare = qr.svgObject(share, {level: 'H'})
                    doc.translate(260, 250).scale(1.5)
                        .path(qrShare.path)
                        .fill('black', 'even-odd')
                        .stroke()
                        .restore()
                
                doc.fontSize(7.4)
                    .text(share, {
                        width: 200,
                        align: 'center'
                    })
                
                doc.fontSize(12)
                    .moveDown(2)
                    .text('Theoretically, the combination of these shares that yields to the recover of the master key to decode the secret can be executed without SharedSecrets.', {
                        align: 'justify',
                        width: mainTextWidht
                    })
                    .moveDown()
                    .text('However, we offer a client-side script that reads the QR-codes of each share and decode the message for the user in possession of the minimum number of shares to recover the decryption key.', {
                        align: 'justify',
                        width: mainTextWidht
                    })
                    .moveDown()
    
                doc.fontSize(7)
                    .text(`http://sharedsecrets.net/get?tx=${tx}&ns=${nRequired}`, {
                        align: 'center',
                        width: mainTextWidht
                    })
                    
    
                doc.save()
                const getQR = qr.svgObject(`http://sharedsecret.net/get?tx=${tx}&ns=${nRequired}`)
                doc.translate(195, 605).scale(1.5)
                    .path(getQR.path)
                    .fill('black', 'even-odd')
                    .stroke()
                    .restore()
    
                doc.fontSize(12)
                doc.moveDown(10)
                
                doc.fontSize(5)
                    .text('SharedSecret 1.0', {
                        align: 'center',
                        width: mainTextWidht
                    })
                    .restore()
                if (filename) {
                    filename += `.${timeStamp}.share.${i + 1}.pdf`
                    const pathFile = path.resolve(__dirname, '../scratch', filename)
                    const tmpOutput = fs.createWriteStream(pathFile)
                    doc.pipe(tmpOutput)
                    doc.end()
                    tmpOutput.on('finish', () => {
                        console.log('done')
                    })
                }
                else {
                    const tempFileName = `SecretShare.${timeStamp}.share.${i + 1}.pdf`
                    const stream = doc.pipe(blobStream())
                    doc.end()
                    stream.on('finish', () => {
                        const blob = stream.toBlob('application/pdf')
                        FileSaver.saveAs(blob, tempFileName)
                        resolve(url)
                    })
                }
            })
        })  
    })
}
