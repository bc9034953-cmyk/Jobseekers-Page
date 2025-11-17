import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { pick, types } from '@react-native-documents/picker';
import { useSelector } from 'react-redux';
import { Colors } from '../../../theme/color';
import style from '../../../theme/style';
import { attachFile, getParsedJson, showError } from '../../../utils';
import useRequestPermission from '../../../components/useRequestPermission';

export default function Uploader({ handleUpdateProfile, isProfileUpdating }) {
  const [isLoading, setIsLoading] = useState(false);

  const userData = useSelector(state => state.users.data);
  const hasLoading = isProfileUpdating || isLoading;

  const { requestGalleryPermission } = useRequestPermission();

  async function chooseFile() {
    try {
      const res = await pick({
        type: [types.pdf, types.doc, types.docx],
      });

      if (res[0].size > 3000000) {
        showError('Error! File size must be less than 3 MB.');
        return false;
      }

      const formData = new FormData();
      formData.append('attachment', {
        uri: res[0].uri,
        type: res[0].type,
        name: res[0].name,
      });

      setIsLoading(true);
      const response = await attachFile(
        'customers/attachment',
        formData,
        userData?.token,
      );

      const parsedResponse = getParsedJson(response);

      if (parsedResponse?.files) {
        const file = parsedResponse?.files[0];

        if (file) {
          handleUpdateProfile({ name: file?.name, size: file?.size }, 'update');
        }
      }

      if (parsedResponse?.error) {
        showError(parsedResponse?.error);
      }
    } catch (err) {
      console.log('err::', err);

      setIsLoading(false);

      // User cancelled the picker, exit any dialogs or menus and move on
      if (err && err.code === 'OPERATION_CANCELED') {
        // showError(err);
        console.log('err::', err);
      } else {
        showError('Failed to upload file!');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <TouchableOpacity
      disabled={isLoading}
      style={styles.resumeWrapperUploader}
      onPress={() => requestGalleryPermission(chooseFile)}>
      {hasLoading ? (
        <>
          <ActivityIndicator style={{}} color={Colors.primary} />
          <Text style={[style.r12, { color: Colors.txt }]}>
            Uploading your resume ...
          </Text>
        </>
      ) : (
        <>
          <Text style={[style.s18, { color: Colors.txt }]}>Upload Resume</Text>
          <Text style={[style.r12, { color: Colors.txt }]}>
            Upload PDF, DOC or DOCx file only
          </Text>
          <Text style={[style.r12, { color: Colors.txt }]}>
            Max file size: 3 MB
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  resumeWrapperUploader: {
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    minHeight: 100,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
