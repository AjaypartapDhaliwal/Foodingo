import React from 'react';
import Navigator from './route/LoginStack';
import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); // Ignore all log notifications



export default function App() {

  return (
    <Navigator
    />
  )

}