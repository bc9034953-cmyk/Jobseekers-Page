import { ActivityIndicator } from '@react-native-material/core';
import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Dimensions,
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
import Icon from 'react-native-vector-icons/Octicons';
import { useSelector } from 'react-redux';
import SelectorView from '../../../components/SelectorView';
import TextInputRow from '../../../components/TextInputRow';
import { Colors } from '../../../theme/color';
import style from '../../../theme/style';
import { showError, showSuccess } from '../../../utils';
import { contentApiSlice } from '../../api-slices/content-api-slice';

const height = Dimensions.get('screen').height;

export default function UpsertCertificationsModal({
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

  const yearOptionsData = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const options = [];
    for (let year = currentYear; year >= 1950; year--) {
      options.push({
        label: `${year}`,
        value: `${year}`,
      });
    }
    return options;
  }, []);

  const expirationYearOptionsData = React.useMemo(() => {
    const options = [];
    for (let year = 2070; year >= 1950; year--) {
      options.push({
        label: `${year}`,
        value: `${year}`,
      });
    }
    return options;
  }, []);

  const monthOptionsData = React.useMemo(() => {
    const months = [
      { label: 'January', value: '01' },
      { label: 'February', value: '02' },
      { label: 'March', value: '03' },
      { label: 'April', value: '04' },
      { label: 'May', value: '05' },
      { label: 'June', value: '06' },
      { label: 'July', value: '07' },
      { label: 'August', value: '08' },
      { label: 'September', value: '09' },
      { label: 'October', value: '10' },
      { label: 'November', value: '11' },
      { label: 'December', value: '12' },
    ];
    return months;
  }, []);

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
        title: details?.title || '',
        organization: details?.organization || '',
        url: details?.url || '',
        issue_month: details?.issue_month || '',
        issue_year: details?.issue_year || '',
        expiration_month: details?.expiration_month || '',
        expiration_year: details?.expiration_year || '',
        has_expiration:
          details?.expiration_month && details?.expiration_year ? true : false,
      });
    } else {
      setFormData({
        title: '',
        organization: '',
        url: '',
        issue_month: '',
        issue_year: '',
        expiration_month: '',
        expiration_year: '',
        has_expiration: false,
      });
    }
  }, [selectedItem, details]);

  const handleSubmit = async () => {
    if (!formData?.title) {
      setErrors({ title: 'Certification name is required' });
      return;
    }

    if (!formData?.organization) {
      setErrors({ organization: 'Certification organization is required' });
      return;
    }

    if (!formData?.issue_month) {
      setErrors({ issue_month: 'Issue month is required' });
      return;
    }

    if (!formData?.issue_year) {
      setErrors({ issue_year: 'Issue year is required' });
      return;
    }

    if (formData?.has_expiration) {
      if (!formData?.expiration_month) {
        setErrors({ expiration_month: 'Expiration month is required' });
        return;
      }

      if (!formData?.expiration_year) {
        setErrors({ expiration_year: 'Expiration year is required' });
        return;
      }

      // Check if expiration date is before issue date
      const issueDate = new Date(
        parseInt(formData.issue_year),
        parseInt(formData.issue_month) - 1,
      );
      const expirationDate = new Date(
        parseInt(formData.expiration_year),
        parseInt(formData.expiration_month) - 1,
      );

      if (expirationDate < issueDate) {
        setErrors({
          expiration_year: 'Expiration date cannot be before issue date',
        });
        return;
      }
    }

    try {
      const payload = {
        type: 'candidate_certifications',
        AdditionalFields: {
          title: formData.title,
          organization: formData.organization,
          url: formData.url,
          issue_month: formData.issue_month,
          issue_year: formData.issue_year,
          expiration_month: formData.has_expiration
            ? formData.expiration_month
            : '',
          expiration_year: formData.has_expiration
            ? formData.expiration_year
            : '',
          candidate_id: userData?.customer?.id?.toString(),
        },
      };

      let response = null;
      let message =
        'Your certification details have been updated successfully.';

      if (selectedItem) {
        response = await updateContent({
          id: selectedItem?.id,
          data: payload,
        }).unwrap();
      } else {
        response = await createContent(payload).unwrap();
        message = 'Your certification details have been added successfully.';
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
    Alert.alert(
      'Delete Certification',
      'Are you sure you want to delete this certification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const deleteApi = async () => {
                const response = await deleteContent(selectedItem?.id).unwrap();
                if (response) {
                  setIsVisible(false);
                  showSuccess('Certification deleted successfully.');
                }
              };
              deleteApi();
            } catch (error) {
              showError(error, 4000, null, true);
            }
          },
        },
      ],
    );
  };

  const handleExpirationToggle = () => {
    setFormData(prev => ({
      ...prev,
      has_expiration: !prev.has_expiration,
      expiration_month: !prev.has_expiration ? '' : prev.expiration_month,
      expiration_year: !prev.has_expiration ? '' : prev.expiration_year,
    }));
    setErrors(prev => ({
      ...prev,
      expiration_month: '',
      expiration_year: '',
    }));
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
            {selectedItem ? 'Update' : 'Add'} Certification
          </Text>
          <Text style={[style.r12, { color: Colors.txt }]}>
            Add your certifications and credentials to showcase your expertise
            to potential employers.
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
              label="Certification name*"
              name="title"
              placeholder="Eg. Certified in Microsoft Excel"
              value={formData?.title}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />

            <TextInputRow
              v="v2"
              label="Certification organization*"
              name="organization"
              placeholder="Eg. Microsoft"
              value={formData?.organization}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />

            <TextInputRow
              v="v2"
              label="Certification URL"
              name="url"
              placeholder="Enter certificate URL"
              value={formData?.url}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              autoCapitalize="none"
            />

            <Text style={[style.m14, { color: Colors.txt, marginTop: 15 }]}>
              Certification issue date*
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: -25 }}>
              <View style={{ flex: 1 }}>
                <SelectorView
                  data={monthOptionsData}
                  showAlphabetical={false}
                  formData={formData}
                  setFormData={setFormData}
                  value={formData?.issue_month}
                  errors={errors}
                  setErrors={setErrors}
                  name="issue_month"
                  placeholder="Select month"
                  dropdownPosition="top"
                />
              </View>
              <View style={{ flex: 1 }}>
                <SelectorView
                  data={yearOptionsData}
                  showAlphabetical={false}
                  formData={formData}
                  setFormData={setFormData}
                  value={formData?.issue_year}
                  errors={errors}
                  setErrors={setErrors}
                  name="issue_year"
                  placeholder="Select year"
                  dropdownPosition="top"
                />
              </View>
            </View>

            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={handleExpirationToggle}>
                <View
                  style={[
                    styles.checkbox,
                    formData?.has_expiration && styles.checkboxChecked,
                  ]}>
                  {formData?.has_expiration && (
                    <Icon name="check" size={16} color={Colors.white} />
                  )}
                </View>
                <Text
                  style={[style.m14, { color: Colors.txt, marginLeft: 10 }]}>
                  This certification expires
                </Text>
              </TouchableOpacity>
            </View>

            {formData?.has_expiration && (
              <>
                <Text style={[style.m14, { color: Colors.txt, marginTop: 15 }]}>
                  Expiration Date
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    marginTop: -25,
                  }}>
                  <View style={{ flex: 1 }}>
                    <SelectorView
                      data={monthOptionsData}
                      showAlphabetical={false}
                      formData={formData}
                      setFormData={setFormData}
                      value={formData?.expiration_month}
                      errors={errors}
                      setErrors={setErrors}
                      name="expiration_month"
                      placeholder="Select month"
                      dropdownPosition="top"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <SelectorView
                      data={expirationYearOptionsData}
                      showAlphabetical={false}
                      formData={formData}
                      setFormData={setFormData}
                      value={formData?.expiration_year}
                      errors={errors}
                      setErrors={setErrors}
                      name="expiration_year"
                      placeholder="Select year"
                      dropdownPosition="top"
                    />
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          {selectedItem ? (
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    paddingVertical: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
});
