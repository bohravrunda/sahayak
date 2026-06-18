let emergencyData = {
  fileUrl: '',
  encryptedKey: '',
};

export const setEmergencyData = (data) => {
  emergencyData = data;
};

export const getEmergencyData = () => {
  return emergencyData;
};

export const clearEmergencyData = () => {
  emergencyData = {
    fileUrl: '',
    encryptedKey: '',
  };
};