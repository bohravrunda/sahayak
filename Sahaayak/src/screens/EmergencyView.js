import React, { useState } from "react";
import {
  View,
 Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";

export default function EmergencyView({ route }) {

const sessionId =
  route?.params?.sessionId;

const [otp, setOtp] = useState("");
const [key, setKey] = useState("");
const [image, setImage] = useState(null);

 const verifyAndDecrypt = async () => {

  try {

    const response = await fetch(
      "http://192.168.1.8:3000/emergency/verify-session",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          sessionId,
          otp,
          key,
        }),
      }
    );

    const data =
      await response.json();

    if (data.success) {

      setImage(
        data.imageBase64
      );

    } else {

      Alert.alert(
        "Error",
        data.message
      );
    }

  } catch (err) {

    console.log(err);

    Alert.alert(
      "Error",
      "Failed to verify session"
    );
  }
};
  return (
    <View style={styles.container}>

      {!image ? (
        <View style={styles.box}>

          <Text style={styles.title}>
            Enter OTP
          </Text>

          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            placeholder="OTP"
          />

          <TextInput
            style={styles.input}
            value={key}
            onChangeText={setKey}
            placeholder="Decrypt Key"
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={verifyAndDecrypt}
          >
            <Text style={{ color: "white" }}>
              Unlock
            </Text>
          </TouchableOpacity>

        </View>
      ) : (
        <Image
  source={{
    uri: `data:image/jpeg;base64,${image}`
  }}
  style={{
    width: "100%",
    height: 400,
  }}
/>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  box: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 5,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },

  btn: {
    backgroundColor: "green",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
});