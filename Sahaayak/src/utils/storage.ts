import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "authToken";

// Save token
export const saveToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

// Get token
export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

// Remove token (e.g., logout)
export const removeToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};
