import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.7:3000/auth",
  timeout: 10000,
});

// ================= COMMON ERROR HANDLER =================
const handleError = (err, defaultMsg) => {
  console.log("API ERROR:", err.response?.data || err.message);
  return err.response?.data || { ok: false, message: defaultMsg };
};

// ================= SIGNUP =================
// DTO → name + email only
export const signup = async (name, email) => {
  try {
    const res = await API.post("/signup", { name, email });
    return res.data;
  } catch (err) {
    return handleError(err, "Signup failed");
  }
};

// ================= VERIFY OTP =================
// returns token
export const verifyOtp = async (email, otp) => {
  try {
    const res = await API.post("/verify-otp", { email, otp });
    return res.data; // should contain token
  } catch (err) {
    return handleError(err, "OTP verification failed");
  }
};

// ================= SET PASSWORD =================
// needs token
export const setPassword = async (token, password, confirmPassword) => {
  try {
    const res = await API.post(
      "/set-password",
      { password, confirmPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    return handleError(err, "Set password failed");
  }
};

// ================= LOGIN =================
export const login = async (email, password) => {
  try {
    const res = await API.post("/login", { email, password });
    return res.data;
  } catch (err) {
    return handleError(err, "Login failed");
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (email) => {
  try {
    const res = await API.post("/forgot-password", { email });
    return res.data;
  } catch (err) {
    return handleError(err, "Error sending reset OTP");
  }
};

// ================= VERIFY RESET OTP =================
export const verifyResetOtp = async (email, otp) => {
  try {
    const res = await API.post("/verify-reset-otp", { email, otp });
    return res.data; // should return resetToken
  } catch (err) {
    return handleError(err, "Reset OTP verification failed");
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (token, newPassword) => {
  try {
    const res = await API.post(
      "/reset-password",
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    return handleError(err, "Password reset failed");
  }
};

// ================= GOOGLE LOGIN =================
export const googleLogin = async (idToken) => {
  try {
    const res = await API.post("/google/mobile-login", { idToken });
    return res.data;
  } catch (err) {
    return handleError(err, "Google login failed");
  }
};