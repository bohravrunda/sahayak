let emergencyData = {
  fileUrl: null,
  encryptedKey: null,
};

let hasUnreadNotification = false;

// 🔥 Save emergency payload
export const setEmergencyData = (data) => {
  emergencyData = data;
  hasUnreadNotification = true;
};

// 🔥 Get emergency payload
export const getEmergencyData = () => {
  return emergencyData;
};

// 🔥 Badge control
export const setUnreadNotification = (value) => {
  hasUnreadNotification = value;
};

export const getUnreadNotification = () => {
  return hasUnreadNotification;
};

// 🔥 clear after opening
export const clearEmergencyData = () => {
  emergencyData = { fileUrl: null, encryptedKey: null };
  hasUnreadNotification = false;
};