import crypto from 'node:crypto'
import { ENC_SECRET_KEY, IV_LENGTH } from '../../../../config/config.service.js';


export const generateEncryption = (plaintext) => {
    
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipherIV = crypto.createCipheriv('aes-256-cbc', ENC_SECRET_KEY, iv)
    let cipherText = cipherIV.update(plaintext, 'utf-8', 'hex')
    cipherText += cipherIV.final('hex')
    
    return `${iv.toString('hex')}:${cipherText}`
}

export const generateDecryption = (cipherText) => {

    const [iv, encryptedData] = cipherText.split(':') || [];
    const binaryIV = Buffer.from(iv, 'hex')
    const deCipherText = crypto.createDecipheriv('aes-256-cbc', ENC_SECRET_KEY, binaryIV)
    let plainText = deCipherText.update(encryptedData, 'hex', 'utf-8')
    plainText += deCipherText.final('utf-8')

    return plainText
}