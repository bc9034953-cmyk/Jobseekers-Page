import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import Button from '../../../../components/Button';
import {showError, showSuccess} from '../../../../utils';
import ScreenLayout from '../../../ScreenLayout';
import BasicDetails from './BasicDetails';
import {jobsApiSlice} from '../../../api-slices/jobs-api-slice';
import AppLoader from '../../../../components/AppLoader';

export default function JobForm({route}) {
  const params = route.params;
  const navigation = useNavigation();
  const jobDetails = params?.details;

  const [loading, setLoading] = useState(true);

  const [createJob, {isLoading: createLoading}] =
    jobsApiSlice.useCreateJobMutation();

  const [updateJob, {isLoading: updateLoading}] =
    jobsApiSlice.useUpdateJobMutation();

  const isLoading = createLoading || updateLoading;

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      setLoading(false);
    }
  }, [isFocused]);

  const initial_state = {
    job_title: jobDetails?.job_title || '',
    job_company_id: jobDetails?.job_company_id || '',
    job_location_id: jobDetails?.job_location_id || '',
    job_category_id: jobDetails?.job_category_id || '',
    total_number_of_vacancies: jobDetails?.total_number_of_vacancies || 1,
    minimum_experience_required: jobDetails?.minimum_experience_required || '',
    minimum_salary_per_month: jobDetails?.minimum_salary_per_month || '',
    qualifications_required: jobDetails?.qualifications_required || '',
    job_type: jobDetails?.job_type || '',
    job_position: jobDetails?.job_position || '',
    job_responsibilities: jobDetails?.job_responsibilities || '',
    skills_and_experience: jobDetails?.skills_and_experience || '',
    search_keywords: jobDetails?.search_keywords || '',
    job_status: jobDetails?.job_status || 'Open',
  };
  const [formData, setFormData] = useState(initial_state);

  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    if (!formData.job_title) {
      setErrors({job_title: 'Please enter job title'});
      return;
    }

    if (!formData.job_company_id) {
      setErrors({job_company_id: 'Please select a company'});
      return;
    }

    if (!formData.job_category_id) {
      setErrors({job_category_id: 'Please select job industry'});
      return;
    }

    if (!formData.job_location_id) {
      setErrors({job_location_id: 'Please select job location'});
      return;
    }

    if (!formData.total_number_of_vacancies) {
      setErrors({
        total_number_of_vacancies: 'Enter a total number of vacancies',
      });
      return;
    }

    if (!formData.minimum_experience_required) {
      setErrors({
        minimum_experience_required: 'Please enter minimum experience',
      });
      return;
    }

    if (!formData.minimum_salary_per_month) {
      setErrors({minimum_salary_per_month: 'Please enter minimum salary'});
      return;
    }

    if (!formData.job_type) {
      setErrors({job_type: 'Please employement type'});
      return;
    }

    if (!formData.job_position) {
      setErrors({job_position: 'Please enter job position'});
      return;
    }

    if (!formData.search_keywords) {
      setErrors({search_keywords: 'Please enter search keywords'});
      return;
    }

    try {
      let response = null;

      if (jobDetails) {
        response = await updateJob({
          id: jobDetails?.id,
          data: formData,
        }).unwrap();
      } else {
        response = await createJob({...formData}).unwrap();
      }

      if (response) {
        showSuccess(`Job ${jobDetails ? 'Updated' : 'Added'} Successfully`);
        navigation.navigate('ManageJobs');
      }
    } catch (error) {
      showError(error);
    }
  };

  if (loading) {
    return (
      <ScreenLayout title={`${jobDetails ? 'Update' : 'Post a'} Job`}>
        <AppLoader />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title={`${jobDetails ? 'Update' : 'Post a'} Job`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}>
        <BasicDetails
          errors={errors}
          setErrors={setErrors}
          formData={formData}
          setFormData={setFormData}
        />
      </ScrollView>

      <Button
        styles={{marginVertical: 15}}
        isLoading={isLoading}
        onPress={handleSubmit}>
        Save
      </Button>
    </ScreenLayout>
  );
}
