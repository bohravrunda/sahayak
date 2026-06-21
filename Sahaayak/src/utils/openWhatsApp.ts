import { Linking } from 'react-native';

export const openWhatsApp = (
  phone: string,
  emergencyId: string,
  encryptedKey: string
) => {

  const viewLink =
    `http://192.168.1.8:3000/emergency/view/${emergencyId}`;

  const message = encodeURIComponent(
`🚨 Emergency Alert!

User may be in danger.

Open:
${viewLink}

Decrypt key:
${encryptedKey}`
  );

  const url =
    `whatsapp://send?phone=${phone}&text=${message}`;

  Linking.openURL(url)
    .catch(err => {
      console.log('WhatsApp error:', err);
    });
};