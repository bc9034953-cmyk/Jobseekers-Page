import { useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { showPermissionSettingsAlert } from '../utils';

function useRequestPermission() {
  const requestCameraPermission = useCallback(async onSuccess => {
    try {
      // For iOS, we don't need to request camera permission explicitly
      // as react-native-image-picker handles it automatically
      if (Platform.OS === 'ios') {
        onSuccess();
        return true;
      }

      // For Android, check if permission is already granted
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (hasPermission) {
        onSuccess();
        return true;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        onSuccess();
        return true;
      } else {
        console.log('Camera permission denied');
        showPermissionSettingsAlert(
          'Camera access is required to take photos.',
        );
        return false;
      }
    } catch (err) {
      console.warn('Camera permission error:', err);
      showPermissionSettingsAlert('Camera access is required to take photos.');
      return false;
    }
  }, []);

  const requestGalleryPermission = useCallback(async onSuccess => {
    try {
      // For iOS, we don't need to request gallery permission explicitly
      // as react-native-image-picker handles it automatically
      if (Platform.OS === 'ios') {
        onSuccess();
        return true;
      }

      let granted = false;

      if (Platform.Version >= 33) {
        // Android 13+ (API 33+)
        const imagePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Gallery Permission',
            message: 'This app needs access to your gallery to select photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        granted = imagePermission === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android 12 and below (API 32-)
        const storagePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your storage to select files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        granted = storagePermission === PermissionsAndroid.RESULTS.GRANTED;
      }

      if (granted) {
        console.log('Gallery permission granted');
        onSuccess();
        return true;
      } else {
        console.log('Gallery permission denied');
        showPermissionSettingsAlert(
          'Gallery access is required to select files.',
        );
        return false;
      }
    } catch (err) {
      console.warn('Gallery permission error:', err);
      showPermissionSettingsAlert(
        'Gallery access is required to select files.',
      );
      return false;
    }
  }, []);

  return {
    requestCameraPermission,
    requestGalleryPermission,
  };
}

export default useRequestPermission;
