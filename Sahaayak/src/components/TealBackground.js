// src/components/TealBackground.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../styles/colors';


export default function TealBackground({ children }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 20,
  },
});
