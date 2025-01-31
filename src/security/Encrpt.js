import CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../Constant/MyConstants';
// Encryption function 
export const encrypt = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    return ciphertext;
  };


  // Decryption function
export const decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };