import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key"; // Use a strong secret key

export const encryptId = (id) => {
  return CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
};

export const decryptId = (encryptedId) => {
  const bytes = CryptoJS.AES.decrypt(encryptedId, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
