import {Spacer} from '@react-native-material/core';
import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../../components/Button';
import {getParsedJson, showError, showSuccess} from '../../../utils';
import ScreenLayout from '../../ScreenLayout';
import {usersApiSlice} from '../../users-api-slice';
import {setUserData} from '../../users-slice';
import BasicDetails from './BasicDetails';

export default function EmployerProfileForm() {
  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;
  const dispatch = useDispatch();

  const customerAdditional = getParsedJson(customer?.additional_fields, null);

  const initial_state = {
    name: customer?.name || '',
    email: customer?.email || '',
    mobile_number: customer?.mobile_number || '',
    profile_picture: customerAdditional?.profile_picture || '',
  };

  const [formData, setFormData] = useState(initial_state);

  const [errors, setErrors] = useState({});

  const [updateProfile, {isLoading}] = usersApiSlice.useUpdateProfileMutation();

  const onFormSubmit = async () => {
    if (!formData.name) {
      setErrors({name: 'Please enter your name'});
      return;
    }

    try {
      const payload = {
        id: customer?.id,
        name: formData?.name,
        AdditionalFields: {
          profile_picture: formData?.profile_picture,
        },
      };

      const response = await updateProfile(payload).unwrap();

      if (response) {
        dispatch(
          setUserData({
            token: userData?.token,
            customer: response,
          }),
        );
        showSuccess('Profile updated successfully.');
      }
    } catch (error) {
      showError(error);
    }
  };

  return (
    <ScreenLayout title="Edit Profile">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacer h={30} />
        <BasicDetails
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />

        <Spacer h={30} />

        <Button onPress={onFormSubmit} isLoading={isLoading}>
          Update Profile
        </Button>

        <Spacer h={30} />
      </ScrollView>
    </ScreenLayout>
  );
}
