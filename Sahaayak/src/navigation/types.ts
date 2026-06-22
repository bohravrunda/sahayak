export type RootStackParamList = {
  Dashboard: undefined;

  EmergencyContactsScreen: undefined;

  EmergencyView: {
    emergencyId: string;
    fileName: string;
    aesKey: string;
    
    // 🔥 Dynamic discriminator to verify decrypted render layouts
    type: 'audio' | 'image';
  };

  UserProfileScreen: undefined;
};