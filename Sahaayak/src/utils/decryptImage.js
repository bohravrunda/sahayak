import CryptoJS from "crypto-js";
import RNFS from "react-native-fs";

export const decryptImage = async (fileUrl, encryptedKey, inputKey) => {
  try {
    const downloadPath = RNFS.CachesDirectoryPath + "/temp.enc";

    await RNFS.downloadFile({
      fromUrl: fileUrl,
      toFile: downloadPath,
    }).promise;

    const encryptedData = await RNFS.readFile(downloadPath, "utf8");

    // 🔐 STEP 1: check key match
    const bytes = CryptoJS.AES.decrypt(encryptedKey, inputKey);
    const aesKey = bytes.toString(CryptoJS.enc.Utf8);

    if (!aesKey) return null;

    // 🔐 STEP 2: decrypt image
    const decrypted = CryptoJS.AES.decrypt(encryptedData, aesKey);
    const base64 = decrypted.toString(CryptoJS.enc.Utf8);

    return base64;

  } catch (err) {
    console.log("Decrypt error:", err);
    return null;
  }
};