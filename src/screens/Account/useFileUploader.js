import { useState } from 'react';
import { pick, types } from '@react-native-documents/picker';
import { PermissionsAndroid } from 'react-native';
import Configs from '../../utils/Configs';
import { getParsedJson } from '../../utils';

const useFileUploader = () => {
  const [result, setResult] = useState({ progress: 0 });
  const [fileUrl, setFileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chooseFile = async (userData, path = 'customers/attachment') => {
    setResult({ progress: 0 });
    setFileUrl('');

    try {
      // Pick a single file
      const res = await pick({
        type: [types.allFiles],
      });

      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('attachment', {
        uri: res[0].uri,
        type: res[0].type,
        name: res[0].name,
      });

      // Handle progress
      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          console.log('event::', event);
          const progress = Math.round((event.loaded * 100) / event.total);
          setResult({ progress }); // Update progress in the state
        }
      };

      // Add the event listeners
      xhr.onload = () => {
        const data = getParsedJson(xhr.responseText);

        setResult({ progress: 100, data });

        console.log('response::', xhr.response);
        setIsLoading(false); // Hide loading indicator
      };

      // Set up the request
      xhr.open('POST', `${Configs.API_URL}${path}`);

      // Add the required HTTP header for form data POST requests
      xhr.setRequestHeader('Authorization', `Bearer ${userData?.token}`);

      // Send the request
      setIsLoading(true); // Show loading indicator
      xhr.send(formData);
    } catch (err) {
      if (err && err.code === 'OPERATION_CANCELED') {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log('errr', err);
        setIsLoading(false);
      } else {
        throw err;
      }
    }
  };

  const requestGalleryPermission = async userData => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      console.log('granted::', granted);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await chooseFile(userData);
      } else {
        console.log('Gallery permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return {
    result,
    fileUrl,
    isLoading,
    chooseFile, // Expose chooseFile so it can be triggered manually
    upload: requestGalleryPermission, // Expose requestGalleryPermission method
  };
};

export default useFileUploader;
