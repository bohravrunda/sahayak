import React, { useEffect } from 'react';
import { StatusBar, SafeAreaView, LogBox } from 'react-native';
import AppNavigator from './src/components/AppNavigator';
import { configureGoogleSignIn } from './src/config/googleConfig';

LogBox.ignoreLogs(['Setting a timer']); 

const App: React.FC = () => {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <AppNavigator />
    </SafeAreaView>
  );
};

export default App;