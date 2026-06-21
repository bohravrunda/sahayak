let emergencyData = {
  emergencyId: '',
  aesKey: '',
};

export const setEmergencyData = (data) => {
  emergencyData = data;
};

export const getEmergencyData = () => {
  return emergencyData;
};

export const clearEmergencyData = () => {
  emergencyData = {
    emergencyId: '',
    aesKey: '',
  };
};