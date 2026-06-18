import { Linking } from 'react-native';

export const openWhatsApp = (
  phone: string,
  fileUrl: string,
  encryptedKey: string
) => {

  const message = encodeURIComponent(
    `🚨 Emergency Alert!\n\nUser may be in danger.\n\nFile: ${fileUrl}\nKey: ${encryptedKey}`
  );

  const url = `whatsapp://send?phone=${phone}&text=${message}`;

  Linking.openURL(url).catch(err => {
    console.log('WhatsApp error:', err);
  });
};