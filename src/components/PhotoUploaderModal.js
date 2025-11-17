import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Colors } from '../theme/color';
import style from '../theme/style';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import useRequestPermission from './useRequestPermission';
import { launchCamera } from 'react-native-image-picker';
import { pick, types } from '@react-native-documents/picker';
import { attachFile, getParsedJson, showError } from '../utils';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from '@react-native-material/core';

export default function PhotoUploaderModal({
  isVisible,
  setModalVisible,
  updateLoading,
  handleAfterSuccess,
  attachbucketPath = 'customers/attachment',
}) {
  const refRBSheet = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const authToken = useSelector(state => state.users.authToken);

  const onCloseModal = () => {
    setModalVisible(false);
  };

  const { requestCameraPermission, requestGalleryPermission } =
    useRequestPermission();

  useEffect(() => {
    if (isVisible) {
      refRBSheet?.current?.open();
    } else {
      refRBSheet?.current?.close();
      setModalVisible(false);
    }
  }, [isVisible, setModalVisible]);

  async function chooseFile() {
    try {
      // Pick a single file
      const res = await pick({
        type: [types.images],
      });
      console.log('res::', res);

      if (res[0].size > 3000000) {
        showError(
          'Error! File size must be less than 3 MB.',
          5000,
          null,
          false,
          'top',
        );
        return false;
      }

      const formData = new FormData();

      if (res && res.length > 0) {
        setIsLoading(true);
        formData.append('attachment', {
          uri: res[0].uri,
          type: res[0].type,
          name: res[0].name,
        });

        attachFile(attachbucketPath, formData, authToken)
          .then(data => {
            const parsedRes = getParsedJson(data);
            handleAfterSuccess(parsedRes);
          })
          .catch(err => {
            console.log('err::', err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } catch (err) {
      if (err && err.code === 'OPERATION_CANCELED') {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log('errr', err);
        setIsLoading(false);
      } else {
        showError('Filed to open file picker!', 4000, null, false, 'top');
      }
    }
  }

  async function openCamera() {
    const options = {
      quality: 1,
      maxWidth: 100,
      maxHeight: 100,
      storageOptions: {
        path: 'images',
        skipBackup: true,
      },
      includeBase64: true,
    };

    launchCamera(options, res => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
      } else {
        const formData = new FormData();
        console.log('res::', res);

        if (res) {
          setIsLoading(true);
          formData.append('attachment', {
            uri: res.assets[0].uri,
            type: res.assets[0].type,
            name: res.assets[0].fileName,
          });

          attachFile(attachbucketPath, formData, authToken)
            .then(data => {
              const parsedRes = getParsedJson(data);
              handleAfterSuccess(parsedRes);
            })
            .catch(err => {
              console.log('err--------::', err);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      }
    });
  }

  return (
    <View>
      <RBSheet
        ref={refRBSheet}
        onClose={onCloseModal}
        keyboardAvoidingViewEnabled={true}
        height={210}
        openDuration={200}
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            backgroundColor: Colors.bg,
          },
        }}>
        <View style={styles.container}>
          <Text style={[style.s18, { color: Colors.txt, textAlign: 'center' }]}>
            Upload photo
          </Text>

          {isLoading || updateLoading ? (
            <View style={{ marginTop: 40 }}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => requestGalleryPermission(chooseFile)}>
                <EntypoIcon name="camera" size={20} />
                <Text style={[style.m14, { color: Colors.txt }]}>
                  Choose from gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => requestCameraPermission(openCamera)}>
                <EntypoIcon name="image-inverted" size={20} />

                <Text style={[style.m14, { color: Colors.txt }]}>
                  Take a photo
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 15,
    gap: 10,
  },
  button: {
    padding: 18,
    paddingBottom: 13,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
