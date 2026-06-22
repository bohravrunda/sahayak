// let emergencyData = {
//   emergencyId: null,
//   fileUrl: null,
//   encryptedKey: null,
// };

// let hasUnreadNotification = false;

// export const setEmergencyData = (data) => {
//   emergencyData = data;
//   hasUnreadNotification = true;
// };

// export const getEmergencyData = () => {
//   return emergencyData;
// };

// export const setUnreadNotification = (value) => {
//   hasUnreadNotification = value;
// };

// export const getUnreadNotification = () => {
//   return hasUnreadNotification;
// };

// export const clearEmergencyData = () => {
//   emergencyData = {
//     emergencyId: null,
//     fileUrl: null,
//     encryptedKey: null,
//   };

//   hasUnreadNotification = false;
// };




let emergencyData = {
  emergencyId: null,
  fileUrl: null,
  encryptedKey: null,
  fileType: null, // Dynamic support for tracking 'audio' or 'image/video'
};

let hasUnreadNotification = false;

export const setEmergencyData = (data) => {
  // Safe object merging taaki purani fields block na ho aur naye flags automatic adjust ho jayein
  emergencyData = {
    ...emergencyData,
    ...data
  };
  hasUnreadNotification = true;
};

export const getEmergencyData = () => {
  return emergencyData;
};

export const setUnreadNotification = (value) => {
  hasUnreadNotification = value;
};

export const getUnreadNotification = () => {
  return hasUnreadNotification;
};

export const clearEmergencyData = () => {
  emergencyData = {
    emergencyId: null,
    fileUrl: null,
    encryptedKey: null,
    fileType: null,
  };

  hasUnreadNotification = false;
};

