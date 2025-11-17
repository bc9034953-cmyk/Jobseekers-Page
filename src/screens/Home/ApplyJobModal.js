import {AppBar, Spacer} from '@react-native-material/core';
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import Button from '../../components/Button';
import TextInputRow from '../../components/TextInputRow';
import {Colors} from '../../theme/color';
import style from '../../theme/style';
import {showError, showSuccess} from '../../utils';
import {jobsApplicationsApiSlice} from '../api-slices/job-applications-api-slice';

export default function ApplyJobModal({job}) {
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  const useData = useSelector(state => state.users.data);
  const customer = useData?.customer;

  const [applyJobApplication, {isLoading}] =
    jobsApplicationsApiSlice.useApplyJobApplicationMutation();

  const handleApply = async () => {
    if (!formData?.message) {
      setErrors({message: 'Please enter your message'});
      return;
    }

    try {
      const payload = {
        candidate_id: parseInt(customer?.id, 10),
        job_id: parseInt(job?.id, 10),
        message: formData?.message,
      };

      const response = await applyJobApplication(payload).unwrap();

      if (response) {
        setFormData(null);
        this.RBSheet.close();
        showSuccess('Your Job application successfully submitted.');
      }
    } catch (error) {
      console.log('apply job error::', error);
      showError(error, null, null, true);
    }
  };

  return (
    <RBSheet
      ref={ref => {
        this.RBSheet = ref;
      }}
      height={500}
      openDuration={100}
      customStyles={{
        container: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          backgroundColor: Colors.bg,
        },
      }}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{marginTop: 10, marginHorizontal: 20}}>
          <AppBar
            color={Colors.bg}
            elevation={0}
            title="Apply Job"
            titleStyle={[style.apptitle, {color: Colors.txt}]}
            leading={
              <TouchableOpacity
                onPress={() => this.RBSheet.close()}
                style={[style.icon]}>
                <Icon name="arrow-back" size={24} color={Colors.active} />
              </TouchableOpacity>
            }
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{marginTop: 10}}
            contentContainerStyle={{flexGrow: 1, paddingBottom: 100}}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}>
            <View style={{paddingHorizontal: 5}}>
              <TextInputRow
                type="textarea"
                name="message"
                placeholder="Enter your message"
                numberOfLines={6}
                value={formData?.message}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
              />
            </View>

            <Spacer h={20} />
            <Button onPress={handleApply} isLoading={isLoading}>
              SUBMIT APPLICATION
            </Button>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </RBSheet>
  );
}
