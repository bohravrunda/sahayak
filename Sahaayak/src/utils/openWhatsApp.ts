


// import { Linking } from 'react-native';

// export const openWhatsApp = (
//   phone: string,
//   emergencyId: string,
//   encryptedKey: string,
//   fileType?: string // Added optional parameter to identify 'audio' or 'video'
// ) => {

//   const viewLink =
//     `http://10.205.27.41:3000/emergency/view/${emergencyId}`;

//   // Dynamic alert context header based on fileType
//   const dynamicHeader = fileType === 'audio' 
//     ? `🚨 Emergency Alert (Audio Evidence Recorded)!` 
//     : `🚨 Emergency Alert!`;

//   const message = encodeURIComponent(
// `${dynamicHeader}

// User may be in danger.

// Open to view/listen:
// ${viewLink}

// Decrypt key:
// ${encryptedKey}`
//   );

//   const url =
//     `whatsapp://send?phone=${phone}&text=${message}`;

//   Linking.openURL(url)
//     .catch(err => {
//       console.log('WhatsApp error:', err);
//     });
// };






import { Linking } from 'react-native';

export const openWhatsApp = (
  phone: string,
  emergencyId: string,
  encryptedKey: string,
  fileType?: string, 
  mapsLink?: string  
) => {

  const viewLink =
    `http://10.205.27.41:3000/emergency/view/${emergencyId}`;

  // Dynamic alert context header based on fileType
  const dynamicHeader = fileType === 'audio' 
    ? `🚨 Emergency Alert (Audio Evidence Recorded)!` 
    : `🚨 Emergency Alert!`;

  const locationSection = mapsLink && mapsLink !== "Location not available"
    ? `\n\n📍 Current Location:\n${mapsLink}` 
    : '\n\n📍 Location: Not Available';

  const message = encodeURIComponent(
`${dynamicHeader}

User may be in danger.

Open to view/listen:
${viewLink}

Decrypt key:
${encryptedKey}${locationSection}`
  );

  const url = `whatsapp://send?phone=${phone}&text=${message}`;

  Linking.openURL(url)
    .catch(err => {
      console.log('WhatsApp error:', err);
    });
};