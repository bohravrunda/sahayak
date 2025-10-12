import React from "react";
import { StatusBar } from "react-native";
import AppNavigator from "./src/components/AppNavigator";


const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <AppNavigator />
    </>
  );
};

export default App;
