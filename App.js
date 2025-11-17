import React, { useEffect } from 'react';
import StackNavigator from './src/navigator/StackNavigator';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store from './src/store';
import FlashMessage from 'react-native-flash-message';
import { PaperProvider } from 'react-native-paper';
import SpInAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';
import { Platform } from 'react-native';

const inAppUpdates = new SpInAppUpdates(false);

export default function App() {
  useEffect(() => {
    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    try {
      const result = await inAppUpdates.checkNeedsUpdate();

      if (result?.shouldUpdate) {
        let updateOptions = {};
        if (Platform.OS === 'android') {
          updateOptions = {
            updateType: IAUUpdateKind.FLEXIBLE,
          };
        }

        inAppUpdates.startUpdate(updateOptions);
      }
    } catch (error) {
      if (error.message.includes('InstallException: -10')) {
        console.log(
          'Update check failed: App not owned. Please install from Play Store.',
        );
      } else {
        console.log(error);
      }
    }
  };

  return (
    <PaperProvider>
      <Provider store={store}>
        <StackNavigator />

        <FlashMessage position="bottom" />
      </Provider>
    </PaperProvider>
  );
}
