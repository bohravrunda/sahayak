import axios from 'axios';

// Flask / ML API
const ML_API_URL = 'http://192.168.1.7:5000/predict';

// Backend API
const BASE_URL = 'http://192.168.1.12:3000';

// ================= ML DIRECT API =================
export const detectEmotion = async (imageUri) => {
  try {
    let formData = new FormData();

    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    const response = await axios.post(ML_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.log('Emotion API Error:', error.message);
    return null;
  }
};

// ================= BACKEND API =================
export const analyzeEmotion = async (image) => {
  try {
    const formData = new FormData();

    formData.append('file', {
      uri: image.uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    const response = await axios.post(
      `${BASE_URL}/emotion/analyze`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log('Backend Emotion Error:', error.message);
    return null;
  }
};