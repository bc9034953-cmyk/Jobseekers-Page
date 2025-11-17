import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../../theme/color';
import style from '../../../theme/style';
import { getParsedJson, showError, showSuccess } from '../../../utils';
import Uploader from './Uploader';
import ActionModal from './ActionModal';
import { usersApiSlice } from '../../users-api-slice';
import { setUserData } from '../../users-slice';

export default function ResumeUploader({ additionalDetails }) {
  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;
  const customerAdditional = getParsedJson(customer?.additional_fields, null);
  const dispatch = useDispatch();

  const [updateProfile, { isLoading: isProfileUpdating }] =
    usersApiSlice.useUpdateProfileMutation();

  const handleUpdateProfile = async (resume, action) => {
    // we are supporting two actions `update/delete`

    try {
      // if user uploaded the file and the file was not uploaded then throwing an error.
      if (!resume?.name && action === 'update') {
        throw new Error('Failed to update profile');
      }

      const payload = {
        AdditionalFields: {
          ...customerAdditional,
          resume: resume?.name,
          resume_size: resume?.size?.toString() || '',
        },
      };

      const response = await updateProfile(payload).unwrap();

      if (response) {
        let message = 'Your resume has been updated successfully.';

        if (action === 'delete') {
          message = 'Your resume has been deleted.';
        }

        if (this.RBSheet) {
          this.RBSheet.close();
        }

        showSuccess(message);

        dispatch(setUserData({ ...userData, customer: response }));
      }
    } catch (error) {
      console.log('update profile error::', error);
      showError('Failed to save your resume');
    }
  };

  if (!additionalDetails?.resume) {
    return (
      <Uploader
        handleUpdateProfile={handleUpdateProfile}
        isProfileUpdating={isProfileUpdating}
      />
    );
  }

  function extractFileName(prefixedFileName) {
    const regex = /^(\d+)-/;
    // Test the string for a numeric prefix followed by a hyphen
    if (regex.test(prefixedFileName)) {
      // If the prefix is numeric, remove it along with the hyphen
      return prefixedFileName?.replace(regex, '');
    }

    // If no numeric prefix is found, return the original string
    return prefixedFileName;
  }

  return (
    <>
      <Pressable
        style={styles.resumeWrapper}
        onPress={() => this.RBSheet.open()}>
        <View style={{ flex: 1 }}>
          <Text style={[style.s18, { color: Colors.secondary }]}>
            My Resume
          </Text>
          <Text
            style={[style.r14, { color: Colors.secondary, paddingRight: 20 }]}>
            {extractFileName(additionalDetails?.resume)}
          </Text>
        </View>
        <Icon name="ellipsis-vertical" size={24} color={Colors.secondary} />
      </Pressable>

      <ActionModal
        details={additionalDetails}
        handleUpdateProfile={handleUpdateProfile}
        isProfileUpdating={isProfileUpdating}
      />
    </>
  );
}

const styles = StyleSheet.create({
  resumeWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
});
