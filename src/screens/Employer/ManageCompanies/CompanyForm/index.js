import {ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenLayout from '../../../ScreenLayout';
import Button from '../../../../components/Button';
import Tabs from '../../../../components/Tabs';
import BasicDetails from './BasicDetails';
import AdditionalDetails from './AdditionalDetails';
import {companiesApiSlice} from '../../../api-slices/companies-api-slice';
import CompanyFormMeter from './CompanyFormMeter';
import {
  isValidMobile,
  showError,
  showSuccess,
  validateEmail,
} from '../../../../utils';
import {useNavigation} from '@react-navigation/native';
import AppLoader from '../../../../components/AppLoader';
import useCompanyProfileCompletion from '../../../Account/useCompanyProfileCompletion';

const tabData = [
  {label: 'Basic Details', value: 'Basic'},
  {label: 'Additional Details', value: 'Additional'},
];

export default function CompanyForm({route}) {
  const params = route.params;
  const navigation = useNavigation();
  const companyDetails = params?.details;
  const completionPercentage = useCompanyProfileCompletion(companyDetails);

  const [showForm, setShowForm] = useState(false);

  const [createCompanies, {isLoading: createLoading}] =
    companiesApiSlice.useCreateCompaniesMutation();

  const [updateCompanies, {isLoading: updateLoading}] =
    companiesApiSlice.useUpdateCompaniesMutation();

  const isLoading = createLoading || updateLoading;

  const [activeTab, setActiveTab] = useState('Basic');

  const working_days = `Monday => 9AM-5PM 
Tuesday => 9AM-5PM 
Wednesday => 9AM-5PM 
Thursday => 9AM-5PM 
Friday => 9AM-5PM 
Saturday => Close 
Sunday => Close`;

  const initial_state = {
    logo: companyDetails?.logo || '',
    name: companyDetails?.name || '',
    company_details: companyDetails?.company_details || '',
    owner_name: companyDetails?.owner_name || '',
    total_employees: companyDetails?.total_employees || '',
    establishment_year: companyDetails?.establishment_year || '',
    company_type: companyDetails?.company_type || '',
    working_days: companyDetails?.working_days || working_days,
    map_location: companyDetails?.map_location || '',
    contact_number: companyDetails?.contact_number || '',
    mobile_number: companyDetails?.mobile_number || '',
    email_address: companyDetails?.email_address || '',
    website_url: companyDetails?.website_url || '',
    company_address: companyDetails?.company_address || '',
    job_location_id: companyDetails?.job_location_id || '',
    gst_number: companyDetails?.gst_number || '',
  };
  const [formData, setFormData] = useState(initial_state);

  const [errors, setErrors] = useState({});

  const isBasicTabActive = activeTab === 'Basic' ? 'tabActive' : '';

  const handleSubmit = async () => {
    if (!formData.name) {
      setErrors({name: 'Please enter your company name'});
      return;
    }

    if (validateEmail(formData?.email_address)) {
      setErrors({email_address: validateEmail(formData?.email_address)});
      return;
    }

    if (!isValidMobile(formData.mobile_number)) {
      setErrors({mobile_number: 'Please enter a valid mobile number'});
      return;
    }

    if (!formData.job_location_id) {
      setErrors({job_location_id: 'Select your company location'});
      return;
    }

    try {
      let response = null;

      if (companyDetails) {
        response = await updateCompanies({
          id: companyDetails?.id,
          data: formData,
        }).unwrap();
      } else {
        response = await createCompanies(formData).unwrap();
      }

      if (response) {
        showSuccess(
          `Company ${companyDetails ? 'Updated' : 'Added'} Successfully`,
        );
        navigation.navigate('ManageCompanies');
      }
    } catch (error) {
      showError(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowForm(true);
    }, 100);
  }, []);

  if (!showForm) {
    return (
      <ScreenLayout title={`${companyDetails ? 'Update' : 'Add'} Company`}>
        <AppLoader />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title={`${companyDetails ? 'Update' : 'Add'} Company`}>
      <CompanyFormMeter completionPercentage={completionPercentage} />

      <Tabs
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        tabData={tabData}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}>
        {isBasicTabActive ? (
          <BasicDetails
            errors={errors}
            setErrors={setErrors}
            formData={formData}
            setFormData={setFormData}
          />
        ) : (
          <AdditionalDetails
            errors={errors}
            setErrors={setErrors}
            formData={formData}
            setFormData={setFormData}
          />
        )}

        <Button
          styles={{marginVertical: 15}}
          isLoading={isLoading}
          onPress={handleSubmit}>
          Save
        </Button>
      </ScrollView>
    </ScreenLayout>
  );
}
