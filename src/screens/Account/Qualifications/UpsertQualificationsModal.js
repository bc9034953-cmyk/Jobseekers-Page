import { ActivityIndicator } from '@react-native-material/core';
import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Modal,
  Platform,
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
import TextareaRow from '../../../components/TextareaRow';
import { Colors } from '../../../theme/color';
import style from '../../../theme/style';
import { showError, showSuccess } from '../../../utils';
import { contentApiSlice } from '../../api-slices/content-api-slice';

export default function UpsertQualificationsModal({
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
        university_college: details?.university_college || '',
        start_year: details?.start_year || '',
        end_year: details?.end_year || '',
        details: details?.details || '',
      });
    }
  }, [selectedItem, details]);

  const handleSubmit = async () => {
    if (!formData?.title) {
      setErrors({ title: 'This is required field' });
      return;
    }

    if (!formData?.university_college) {
      setErrors({ university_college: 'This is required field' });
      return;
    }

    if (!formData?.start_year) {
      setErrors({ start_year: 'This is required field' });
      return;
    }

    if (!formData?.end_year) {
      setErrors({ end_year: 'This is required field' });
      return;
    }

    if (formData?.start_year > formData?.end_year) {
      setErrors({
        end_year: "The end year can't be earlier than the start year.",
      });
      return;
    }

    try {
      const payload = {
        type: 'candidate_qualifications',
        AdditionalFields: {
          ...formData,
          candidate_id: userData?.customer?.id?.toString(),
          is_currently_working: formData?.is_currently_working ? 'Yes' : 'No',
        },
      };

      let response = null;
      let message = 'Your qualification updated successfully.';

      if (selectedItem) {
        response = await updateContent({
          id: selectedItem?.id,
          data: payload,
        }).unwrap();
      } else {
        response = await createContent(payload).unwrap();
        message = 'Your qualification added successfully.';
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
        'Delete qualification',
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
            {selectedItem ? 'Update' : 'Add'} Qualifications
          </Text>
          <Text style={[style.r12, { color: Colors.txt }]}>
            Add your educational qualifications and credentials to showcase your
            academic background to potential employers.
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
              label="Title*"
              name="title"
              placeholder="Enter your course name or title"
              value={formData?.title}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />
            <TextInputRow
              v="v2"
              label="University / College*"
              name="university_college"
              placeholder="Enter your university or college name"
              value={formData?.university_college}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />

            <SelectorView
              label="Start Year*"
              data={yearOptionsData}
              showAlphabetical={false}
              formData={formData}
              setFormData={setFormData}
              value={formData?.start_year}
              errors={errors}
              setErrors={setErrors}
              name="start_year"
              placeholder="Select Year"
            />

            <SelectorView
              label="End Year*"
              data={yearOptionsData}
              showAlphabetical={false}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              value={formData?.end_year}
              name="end_year"
              placeholder="Select Year"
            />

            <TextareaRow
              type="textarea"
              name="details"
              label="Details*"
              placeholder="Describe your qualification"
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
});
