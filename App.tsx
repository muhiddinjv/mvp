import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import Test from './src/Test';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SurahViewer from './src/Test2';

export default function App() {
  return (
    <SafeAreaProvider>
      <Test />
    </SafeAreaProvider>
  );
}