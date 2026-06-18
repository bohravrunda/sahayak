import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ⚠️ Change IP if backend PC IP changes
const API = axios.create({
  baseURL: "http://192.168.1.8:3000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});


// ================= TOKEN INTERCEPTOR =================
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    console.log("🔥 TOKEN FROM STORAGE:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ================= GLOBAL ERROR HANDLER =================
const handleError = (err, label) => {
  console.log(`❌ ${label} ERROR:`, err?.response?.data || err.message);

  if (err.response?.data) throw err.response.data;

  if (err.message === "Network Error")
    throw { message: "Cannot connect to server" };

  throw { message: "Something went wrong" };
};


// ================= CREATE PROFILE =================
export const createProfile = async (profileData) => {
  try {
    const res = await API.post("/profile", profileData);
    console.log("✅ PROFILE CREATED:", res.data);
    return res.data;
  } catch (err) {
    handleError(err, "CREATE PROFILE");
  }
};


// ================= GET PROFILE =================
export const getProfile = async () => {
  try {
    const res = await API.get("/profile");
    console.log("✅ PROFILE FETCHED:", res.data);
    return res.data;
  } catch (err) {
    handleError(err, "GET PROFILE");
  }
};


// ================= UPDATE PROFILE =================
export const updateProfile = async (profileData) => {
  try {
    const res = await API.put("/profile", profileData);
    console.log("✅ PROFILE UPDATED:", res.data);
    return res.data;
  } catch (err) {
    handleError(err, "UPDATE PROFILE");
  }
};

export default API;