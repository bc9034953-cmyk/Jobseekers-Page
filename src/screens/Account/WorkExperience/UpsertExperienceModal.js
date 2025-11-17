import CheckBox from '@react-native-community/checkbox';
import { ActivityIndicator } from '@react-native-material/core';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import Icon from 'react-native-vector-icons/Octicons';
import { useSelector } from 'react-redux';
import TextInputRow from '../../../components/TextInputRow';
import TextareaRow from '../../../components/TextareaRow';
import { Colors } from '../../../theme/color';
import style from '../../../theme/style';
import { renderMonth, showError, showSuccess } from '../../../utils';
import { contentApiSlice } from '../../api-slices/content-api-slice';

export default function UpsertExperienceModal({
  selectedItem,
  setSelectedItem,
  isVisible,
  setIsVisible,
}) {
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const scrollViewRef = useRef(null);

  const userData = useSelector(state => state.users.data);
  const details = selectedItem?.additional_fields;

  const [updateContent, { isLoading: updateLoading }] =
    contentApiSlice.useUpdateContentMutation();

  const [createContent, { isLoading: createLoading }] =
    contentApiSlice.useCreateContentMutation();

  const [deleteContent, { isLoading: deleteLoading }] =
    contentApiSlice.useDeleteContentMutation();

  const isLoading = updateLoading || createLoading;

  useEffect(() => {
    if (details) {
      setFormData({
        position: details?.position || '',
        company_name: details?.company_name || '',
        start_year: details?.start_year || '',
        start_month: details?.start_month || '',
        end_year: details?.end_year || '',
        end_month: details?.end_month || '',
        details: details?.details || '',
        is_currently_working:
          details?.is_currently_working === 'Yes' ? true : false,
      });
    }
  }, [selectedItem, details]);

  const [date, setDate] = useState(new Date());
  const [isPickerVisible, setPickerVisibility] = useState(false);

  // picker type should be start_date or end_date
  const [pickerType, setPickerType] = useState('start_date');

  const showPicker = useCallback(
    type => {
      setPickerType(type);

      const isEndDate = type === 'end_date';

      if (isEndDate && formData?.is_currently_working) {
        setPickerVisibility(false);
      } else {
        const month = isEndDate ? formData?.end_month : formData?.start_month;
        const year = isEndDate ? formData?.end_year : formData?.start_year;
        const formattedDate = month ? new Date(year, month - 1) : new Date();

        setDate(formattedDate);
        setPickerVisibility(true);
      }
    },
    [formData],
  );

  const onValueChange = useCallback(
    (_, newDate) => {
      setPickerVisibility(false);

      const dateObject = new Date(newDate);

      // Get the month (getMonth() returns month from 0-11, add 1 to get 1-12)
      const month = dateObject.getMonth() + 1;
      // If needed to display with leading zeros for month
      const formattedMonth = month.toString().padStart(2, '0');

      // Get the year
      const year = dateObject.getFullYear();

      if (newDate) {
        setErrors({});
        setFormData({
          ...formData,
          ...(pickerType === 'start_date' && {
            start_month: formattedMonth,
            start_year: year?.toString() || '',
          }),

          ...(pickerType === 'end_date' && {
            end_month: formattedMonth,
            end_year: year?.toString() || '',
          }),
        });
      }
    },
    [formData, pickerType],
  );

  const getDateValue = (month, year, showPresent = false) => {
    if (!month) {
      return formData?.is_currently_working && showPresent
        ? 'Present'
        : 'Select Date';
    }

    return `${renderMonth(month)}, ${year}`;
  };

  const toggleCheckbox = () => {
    setFormData(prevFormData => {
      const updatedData = {
        ...prevFormData,
        is_currently_working: !prevFormData?.is_currently_working,
      };

      if (updatedData.is_currently_working) {
        updatedData.end_month = '';
        updatedData.end_year = '';
      }

      return updatedData;
    });
  };

  const handleSubmit = async () => {
    if (!formData?.position) {
      setErrors({ position: 'This is required field' });
      return;
    }

    if (!formData?.company_name) {
      setErrors({ company_name: 'This is required field' });
      return;
    }

    if (!formData?.start_month) {
      setErrors({ start_month: 'This is required field' });
      return;
    }

    if (!formData?.is_currently_working && !formData?.end_month) {
      setErrors({ end_month: 'This is required field' });
      return;
    }

    if (
      !formData?.is_currently_working &&
      formData?.start_year > formData?.end_year
    ) {
      setErrors({
        end_month: "The end year can't be earlier than the start year.",
      });
      return;
    }

    if (!formData?.details) {
      setErrors({ details: 'This is required field' });
      return;
    }

    try {
      const payload = {
        type: 'candidate_experiences',
        AdditionalFields: {
          ...formData,
          candidate_id: userData?.customer?.id?.toString(),
          is_currently_working: formData?.is_currently_working ? 'Yes' : 'No',
        },
      };

      let response = null;
      let message = 'Your work experience updated successfully.';

      //  Update new work experience
      if (selectedItem) {
        response = await updateContent({
          id: selectedItem?.id,
          data: payload,
        }).unwrap();
      } else {
        //  Create new work experience
        response = await createContent(payload).unwrap();
        message = 'Your work experience added successfully.';
      }

      if (response?.id) {
        setIsVisible(false);
        showSuccess(message);
      }
    } catch (error) {
      showError(error, 4000, null, true);
    }
  };

  const onCloseModal = () => {
    setIsVisible(false);
    setFormData(null);
    setErrors({});

    if (setSelectedItem) {
      setSelectedItem(null);
    }
  };

  const handleDelete = async () => {
    try {
      const deleteApi = async () => {
        const response = await deleteContent(selectedItem?.id).unwrap();
        if (response) {
          setIsVisible(false);
          showSuccess('Removed successfully.');
        }
      };

      Alert.alert(
        'Delete work experience',
        'Are you sure you want to delete this details ?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => deleteApi() },
        ],
      );
    } catch (error) {
      showError(error, 4000, null, true);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onCloseModal}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[style.s18, { color: Colors.txt }]}>
            {selectedItem ? 'Update' : 'Add'} Work Experience
          </Text>
          <Text style={[style.r12, { color: Colors.txt }]}>
            Add your work experience and professional background to showcase
            your career journey to potential employers.
          </Text>
        </View>

        <View style={styles.content}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled={true}
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
            keyboardDismissMode="none">
            <TextInputRow
              v="v2"
              label="Position*"
              name="position"
              placeholder="Enter your position or title"
              value={formData?.position}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />
            <TextInputRow
              v="v2"
              label="Company*"
              name="company_name"
              placeholder="Enter company name"
              value={formData?.company_name}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />

            <Pressable
              onPress={() => showPicker('start_date')}
              style={{ marginTop: 15 }}>
              <TextInputRow
                v="v2"
                label="Start Date*"
                name="start_month"
                placeholder="Enter company name"
                value={getDateValue(
                  formData?.start_month,
                  formData?.start_year,
                )}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                readOnly={true}
                rightIcon={<Icon name="calendar" size={16} />}
              />
            </Pressable>

            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}
              onPress={toggleCheckbox}>
              <CheckBox
                value={formData?.is_currently_working}
                tintColors={{ true: Colors.primary, false: 'gray' }}
                onValueChange={toggleCheckbox}
              />
              <Text style={[style.m12, styles.checkboxLabel]}>
                I'm currently working here
              </Text>
            </Pressable>

            <Pressable
              onPress={() => showPicker('end_date')}
              style={{ marginTop: 15 }}>
              <TextInputRow
                v="v2"
                label="End Date*"
                name="end_month"
                placeholder="Enter company name"
                value={getDateValue(
                  formData?.end_month,
                  formData?.end_year,
                  true,
                )}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                readOnly={true}
                editable={!formData?.is_currently_working}
                rightIcon={<Icon name="calendar" size={16} />}
              />
            </Pressable>

            {isPickerVisible && (
              <MonthPicker
                onChange={onValueChange}
                value={date}
                locale="en"
                mode="short"
              />
            )}

            <TextareaRow
              type="textarea"
              name="details"
              label="Details*"
              placeholder="Enter company name"
              value={formData?.details}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              numberOfLines={8}
              v="v2"
            />
          </ScrollView>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          {deleteLoading ? (
            <ActivityIndicator color={Colors.txt} size={20} />
          ) : selectedItem ? (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Icon name="trash" size={23} color={Colors.txt} />
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCloseModal}>
              <Text style={[style.m14, { color: Colors.primary }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, { opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleSubmit}
              disabled={isLoading}>
              {isLoading && (
                <ActivityIndicator color="#fff" style={{ marginRight: 5 }} />
              )}
              <Text style={[style.m14, { color: Colors.white }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  bottomBar: {
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: Colors.white,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 22,
    flexDirection: 'row',
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 18,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    paddingVertical: 8,
    paddingRight: 30,
    paddingLeft: 10,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: { color: Colors.txt, marginLeft: 5, marginTop: 3 },
});
