// let emergencyData = {
//   emergencyId: '',
//   aesKey: '',
// };

// export const setEmergencyData = (data) => {
//   emergencyData = data;
// };

// export const getEmergencyData = () => {
//   return emergencyData;
// };

// export const clearEmergencyData = () => {
//   emergencyData = {
//     emergencyId: '',
//     aesKey: '',
//   };
// };












let emergencyData = {
  emergencyId: '',
  aesKey: '',
  fileType: '', // Added to dynamically track if the trigger is 'audio' or 'video'
};

export const setEmergencyData = (data) => {
  // Merging current data structure with new incoming data object keys safely
  emergencyData = { 
    ...emergencyData, 
    ...data 
  };
};

export const getEmergencyData = () => {
  return emergencyData;
};

export const clearEmergencyData = () => {
  emergencyData = {
    emergencyId: '',
    aesKey: '',
    fileType: '',
  };
};