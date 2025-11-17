import {Pressable, View} from 'react-native';
import React, {useState} from 'react';
import TextInputRow from '../../../../components/TextInputRow';
import Selector from '../../../../components/Selector';
import TextareaRow from '../../../../components/TextareaRow';
import {jobsApiSlice} from '../../../api-slices/jobs-api-slice';
import PhotoUploaderModal from '../../../../components/PhotoUploaderModal';
import {Avatar} from '@react-native-material/core';
import {Colors} from '../../../../theme/color';
import {StyleSheet} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getCompanyLogo} from '../../../../utils';

export default function BasicDetails({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const {data: jobLocations} = jobsApiSlice.useGetJobLocationsQuery();
  const jobLocationsData = jobLocations?.map(item => ({
    id: `${item.id}`,
    title: item?.name?.trim() || '',
  }));

  const [isModalVisible, setModalVisible] = useState(false);

  const handleAfterSuccess = data => {
    const files = data.files[0];
    setFormData(prevState => ({...prevState, logo: files?.name}));
    setModalVisible(false);
  };

  return (
    <View>
      <View style={styles.profilePicWrapper}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Avatar
            size={90}
            image={getCompanyLogo(formData?.logo)}
            color="#eee"
            imageStyle={{borderWidth: 1, borderColor: Colors.bord}}
            labelStyle={{color: Colors.disable}}
            initials={false}
          />

          <View style={styles.edit}>
            <Icons name="pencil" color={Colors.txt} />
          </View>
        </Pressable>
      </View>

      <PhotoUploaderModal
        isVisible={isModalVisible}
        setModalVisible={setModalVisible}
        attachbucketPath="jobcompanies/attachment"
        handleAfterSuccess={handleAfterSuccess}
      />

      <TextInputRow
        name="name"
        label="Company Name*"
        placeholder="Enter your company name"
        formData={formData}
        setFormData={setFormData}
        value={formData?.name}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <TextInputRow
        name="email_address"
        label="Email*"
        keyboardType="email-address"
        placeholder="Enter Email Address"
        formData={formData}
        setFormData={setFormData}
        value={formData?.email_address}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        autoCapitalize="none"
      />

      <TextInputRow
        name="mobile_number"
        label="Mobile Number*"
        placeholder="Enter Mobile Number"
        formData={formData}
        setFormData={setFormData}
        value={formData?.mobile_number}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        keyboardType="number-pad"
        maxLength={10}
      />

      <Selector
        placeholder="Select Location"
        label="Company Location*"
        data={jobLocationsData}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        name="job_location_id"
        value={formData?.job_location_id}
      />

      <TextareaRow
        name="company_details"
        label="Company Details"
        placeholder="Enter Company Details"
        formData={formData}
        setFormData={setFormData}
        value={formData?.company_details}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <TextareaRow
        name="company_address"
        label="Company Full Address"
        placeholder="Enter Company Full Address"
        formData={formData}
        setFormData={setFormData}
        value={formData?.company_address}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profilePicWrapper: {
    height: 90,
    width: 90,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 50,
    marginBottom: 15,
  },
  edit: {
    width: 22,
    height: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.bord,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
  },
});
