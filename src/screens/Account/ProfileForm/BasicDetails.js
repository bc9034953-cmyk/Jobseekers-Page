import { View, TouchableOpacity, Text, Pressable } from 'react-native';
import React, { useState, useCallback } from 'react';
import TextInputRow from '../../../components/TextInputRow';
import SelectorWithModal from '../../../components/SelectorWithModal';
import { jobsApiSlice } from '../../api-slices/jobs-api-slice';
import { baseApi } from '../../baseApi';
import { getSettingByKey, toArray, getWorkExpText } from '../../../utils';
import { Colors } from '../../../theme/color';
import style from '../../../theme/style';
import ChangeLoginFieldModal from '../../../components/ChangeLoginFieldModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Octicons';
import moment from 'moment';

export default function BasicDetails({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const { data: jobLocations } = jobsApiSlice.useGetJobLocationsQuery();
  const { data: frontendSettings } = baseApi.useGetFrontendSettingsQuery();

  const [openChangeEmailModal, setOpenChangeEmailModal] = useState(false);
  const [openChangeMobileModal, setOpenChangeMobileModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const jobDesignationList = toArray(
    getSettingByKey(frontendSettings, 'job_designations')?.value,
    '\n',
  );

  const jobTypeList = toArray(
    getSettingByKey(frontendSettings, 'job_types')?.value,
    '\n',
  );

  const workExperienceList = toArray(
    getSettingByKey(frontendSettings, 'total_work_experiences')?.value,
    '\n',
  );

  // Static data for gender and marital status - matching website structure
  const genderData = [
    { id: 'Male', title: 'Male' },
    { id: 'Female', title: 'Female' },
    { id: 'Transgender', title: 'Transgender' },
  ];

  const maritalStatusData = [
    { id: 'Unmarried/Single', title: 'Unmarried/Single' },
    { id: 'Married', title: 'Married' },
    { id: 'Divorced', title: 'Divorced' },
    { id: 'Widowed', title: 'Widowed' },
    { id: 'Separated', title: 'Separated' },
    { id: 'Other', title: 'Other' },
  ];

  const jobTypeData = jobTypeList?.map(item => ({
    id: `${item}`,
    title: item?.trim() || '',
  }));

  const workExperienceData = workExperienceList?.map(item => ({
    id: `${item}`,
    title: getWorkExpText(item),
  }));

  const jobLocationsData = jobLocations?.map(item => ({
    id: `${item.id}`,
    title: item?.name?.trim() || '',
  }));

  // remove duplicate from jobDesignationList
  const uniqueJobDesignationList = jobDesignationList?.filter(
    (item, index, self) =>
      self.findIndex(t => t.toLowerCase() === item.toLowerCase()) === index,
  );

  const jobDesignationData = uniqueJobDesignationList?.map(item => ({
    id: `${item}`,
    title: item?.trim() || '',
  }));

  const handleChangeEmail = () => {
    setOpenChangeEmailModal(true);
  };

  const handleChangeMobile = () => {
    setOpenChangeMobileModal(true);
  };

  const handleEmailChangeSuccess = newEmail => {
    setFormData(prev => ({ ...prev, email: newEmail }));
  };

  const handleMobileChangeSuccess = newMobile => {
    setFormData(prev => ({ ...prev, mobile_number: newMobile }));
  };

  const handleDateChange = useCallback(
    (_event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) {
        setFormData(prev => ({
          ...prev,
          date_of_birth: moment(selectedDate).format('YYYY-MM-DD'),
        }));
      }
    },
    [setFormData],
  );

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const getDateDisplayValue = () => {
    if (!formData?.date_of_birth) {
      return 'Select Date of Birth';
    }
    return moment(formData.date_of_birth).format('DD/MM/YYYY');
  };

  // Setting max date for 18 years ago
  const maxDateAllowed = new Date();
  maxDateAllowed.setFullYear(maxDateAllowed.getFullYear() - 18);

  return (
    <View>
      <TextInputRow
        name="name"
        label="Name*"
        placeholder="Enter Full Name"
        formData={formData}
        setFormData={setFormData}
        value={formData?.name}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <View style={{ flexDirection: 'row', alignItems: 'end' }}>
        <View style={{ flex: 1 }}>
          <TextInputRow
            name="email"
            label="Email*"
            keyboardType="email-address"
            placeholder="Enter Email Address"
            formData={formData}
            setFormData={setFormData}
            value={formData?.email}
            v="v2"
            errors={errors}
            setErrors={setErrors}
            readOnly={true}
          />
        </View>
        <TouchableOpacity
          onPress={handleChangeEmail}
          style={{
            marginLeft: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: Colors.primary,
            backgroundColor: Colors.primary + '10',
            borderRadius: 6,
            marginTop: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={[style.r13, { color: Colors.primary }]}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'end' }}>
        <View style={{ flex: 1 }}>
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
            readOnly={true}
          />
        </View>
        <TouchableOpacity
          onPress={handleChangeMobile}
          style={{
            marginLeft: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: Colors.primary,
            backgroundColor: Colors.primary + '10',
            borderRadius: 6,
            marginTop: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={[style.r13, { color: Colors.primary }]}>Edit</Text>
        </TouchableOpacity>
      </View>

      <SelectorWithModal
        placeholder="Select Designation"
        label="Designation*"
        data={jobDesignationData}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        name="designation"
        value={formData?.designation}
        creatable={true}
        searchable={true}
        searchPlaceholder="Search"
      />

      <Pressable onPress={showDatePickerModal}>
        <TextInputRow
          name="date_of_birth"
          label="Date of Birth*"
          placeholder="Select Date of Birth"
          formData={formData}
          setFormData={setFormData}
          value={getDateDisplayValue()}
          v="v2"
          errors={errors}
          setErrors={setErrors}
          readOnly={true}
          rightIcon={<Icon name="calendar" size={16} />}
        />
      </Pressable>

      <SelectorWithModal
        placeholder="Select Gender"
        label="Gender*"
        data={genderData}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        name="gender"
        value={formData?.gender}
      />

      <SelectorWithModal
        placeholder="Select Marital Status"
        label="Marital Status*"
        data={maritalStatusData}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        name="marital_status"
        value={formData?.marital_status}
      />

      <TextInputRow
        name="fathers_name"
        label="Father's Name"
        placeholder="Enter Father's Name"
        formData={formData}
        setFormData={setFormData}
        value={formData?.fathers_name}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <SelectorWithModal
        placeholder="Select Work Type"
        label="Work Type*"
        data={jobTypeData}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        name="job_type"
        value={formData?.job_type}
      />

      <SelectorWithModal
        placeholder="Select Work Experience"
        label="Total Work Experience*"
        data={workExperienceData}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        name="total_work_experience"
        value={formData?.total_work_experience}
      />

      <SelectorWithModal
        placeholder="Select Location"
        label="Your Location*"
        data={jobLocationsData}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        name="location"
        value={formData?.location}
        searchable={true}
        searchPlaceholder="Search Location"
      />

      <TextInputRow
        name="current_salary_per_month"
        label="Current Salary Per Month*"
        placeholder="Current Salary Per Month"
        formData={formData}
        setFormData={setFormData}
        value={formData?.current_salary_per_month}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        keyboardType="number-pad"
      />

      <TextInputRow
        name="expected_salary_per_month"
        label="Expected Salary Per Month"
        placeholder="Expected Salary Per Month"
        formData={formData}
        setFormData={setFormData}
        value={formData?.expected_salary_per_month}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        keyboardType="number-pad"
      />

      {/* Change Login Field Modals */}
      <ChangeLoginFieldModal
        openModal={openChangeEmailModal}
        setOpenModal={setOpenChangeEmailModal}
        field="email"
        currentValue={formData.email}
        onSuccess={handleEmailChangeSuccess}
      />

      <ChangeLoginFieldModal
        openModal={openChangeMobileModal}
        setOpenModal={setOpenChangeMobileModal}
        field="mobile_number"
        currentValue={formData.mobile_number}
        onSuccess={handleMobileChangeSuccess}
      />

      {showDatePicker && (
        <DateTimePicker
          value={
            formData?.date_of_birth
              ? new Date(formData.date_of_birth)
              : maxDateAllowed
          }
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={maxDateAllowed}
        />
      )}
    </View>
  );
}
