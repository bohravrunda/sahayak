import React from 'react';
import { View, Button, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzeEmotion } from '../services/emotionApi';

const EmotionScreen = () => {

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const res = await analyzeEmotion(result.assets[0]);
      console.log(res);
    }
  };

  return (
    <View>
      <Button title="Pick Image" onPress={pickImage} />
      <Text>Emotion Detection</Text>
    </View>
  );
};

export default EmotionScreen;
