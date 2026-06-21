let emergencyData = {
  emergencyId: null,
  fileUrl: null,
  encryptedKey: null,
};

let hasUnreadNotification = false;

export const setEmergencyData = (data) => {
  emergencyData = data;
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
  };

  hasUnreadNotification = false;
};