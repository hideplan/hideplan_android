import * as Keychain from 'react-native-keychain';
import CryptoJS from "react-native-crypto-js";

//
//Functions for Keychain
//
async function saveToKeychain(username, password, callback) {
  try {
    await Keychain.setGenericPassword(
      username,
      password,
    ).then(
      callback.call()
        )
  } catch (err) {
    console.log("Could not save credentials, " + err );
  }
}

async function loadFromKeychain() {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return credentials 
    } else {
    }
  } catch (err) {
    console.log(err)
  }
}

async function resetKeychain() {
  try {
    await Keychain.resetGenericPassword();
  } catch (err) {
    console.log(err)
  }
}

//
//Encrypt and decrypt with Crypto
//

export const encryptData = (dataForEncryption, cryptoPassword) => {
  // Encrypt data with Crypto
  let data = dataForEncryption.toString()
  let ciphertext = CryptoJS.AES.encrypt(data, cryptoPassword).toString();
  return ciphertext;
}

export const encryptDataPromise = (dataForEncryption, cryptoPassword) => {
  // Encrypt data with Crypto
  return new Promise((resolve, reject) => {

  resolve(CryptoJS.AES.encrypt(dataForEncryption.toString(), cryptoPassword).toString())
})
}


export const decryptData = (encryptedData, cryptoPassword) => {
  // Decrypt data with Crypto
  let bytes = CryptoJS.AES.decrypt(encryptedData, cryptoPassword);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

export const decryptDataCheck = (encryptedData, cryptoPassword) => {
  // Decrypt data with Crypto
  let bytes = CryptoJS.AES.decrypt(encryptedData, cryptoPassword);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);

  if (originalText) {
    return true
  } else {
    return false
  }
}
export const decryptDataCheckPromise = (encryptedData, cryptoPassword) => {
  // Decrypt data with Crypto
  return new Promise((resolve, reject) => {

  let bytes = CryptoJS.AES.decrypt(encryptedData, cryptoPassword);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);

  if (originalText) {
    resolve()
  } else {
    reject()
  }
})
}

module.exports.saveToKeychain = saveToKeychain;
module.exports.loadFromKeychain = loadFromKeychain;
module.exports.resetKeychain = resetKeychain;
