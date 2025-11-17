import {View} from 'react-native';
import React from 'react';
import TextInputRow from '../../../../components/TextInputRow';
import Selector from '../../../../components/Selector';
import TextareaRow from '../../../../components/TextareaRow';
import {jobsApiSlice} from '../../../api-slices/jobs-api-slice';
import Configs from '../../../../utils/Configs';
import {useSelector} from 'react-redux';
import {companiesApiSlice} from '../../../api-slices/companies-api-slice';

export default function BasicDetails({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const {data: jobLocations, isLoading: locationLoading} =
    jobsApiSlice.useGetJobLocationsQuery();
  const jobLocationsData = jobLocations?.map(item => ({
    id: `${item.id}`,
    title: item?.name?.trim() || '',
  }));

  const userData = useSelector(state => state.users.data);
  const {data: companies, isLoading: companyLoading} =
    companiesApiSlice.useGetCompaniesQuery({
      'JobCompaniesSearch[employer_id]': userData?.customer?.id,
    });

  const {data: jobCategories, isLoading: categoryLoading} =
    jobsApiSlice.useGetJobCategoriesQuery();

  const companyDD = companies?.map(item => ({
    id: `${item.id}`,
    title: item?.name?.trim() || '',
  }));

  const jobCategoriesDD = jobCategories?.map(item => ({
    id: `${item.id}`,
    title: item?.name?.trim() || '',
  }));

  const employmentTypesDD = Object.keys(Configs.EMPLOYMENT_TYPES)?.map(key => ({
    id: Configs.EMPLOYMENT_TYPES[key],
    title: Configs.EMPLOYMENT_TYPES[key],
  }));

  return (
    <View>
      <TextInputRow
        name="job_title"
        label="Job Title*"
        placeholder="Enter Job Title"
        formData={formData}
        setFormData={setFormData}
        value={formData?.job_title}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <Selector
        placeholder="Select Company"
        label="Select Company*"
        data={companyDD}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        name="job_company_id"
        value={formData?.job_company_id}
        loading={companyLoading}
      />

      <Selector
        placeholder="Select Job Industry"
        label="Job Industry*"
        data={jobCategoriesDD}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        name="job_category_id"
        value={formData?.job_category_id}
        loading={categoryLoading}
      />

      <Selector
        placeholder="Select Location"
        label="Job Location*"
        data={jobLocationsData}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        name="job_location_id"
        value={formData?.job_location_id}
        loading={locationLoading}
      />

      <TextInputRow
        name="total_number_of_vacancies"
        label="Total Number Of Vacancies*"
        placeholder="Enter Total Number Of Vacancies"
        formData={formData}
        setFormData={setFormData}
        value={formData?.total_number_of_vacancies?.toString()}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        keyboardType="number-pad"
        maxLength={10}
      />

      <TextInputRow
        name="minimum_experience_required"
        label="Minimum Experience Required /Years*"
        placeholder="Minimum Experience Required (In Years)"
        formData={formData}
        setFormData={setFormData}
        value={formData?.minimum_experience_required?.toString()}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        keyboardType="number-pad"
        maxLength={10}
      />

      <TextInputRow
        name="minimum_salary_per_month"
        label="Minimum Salary Per Month*"
        placeholder="Minimum Salary Per Month"
        formData={formData}
        setFormData={setFormData}
        value={formData?.minimum_salary_per_month?.toString()}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        keyboardType="number-pad"
        maxLength={10}
      />

      <Selector
        placeholder="Select Employement Type"
        label="Employement Type*"
        data={employmentTypesDD}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        name="job_type"
        value={formData?.job_type}
      />

      <TextInputRow
        name="job_position"
        label="Job Position*"
        placeholder="e.g. Manager, CEO, GM etc"
        formData={formData}
        setFormData={setFormData}
        value={formData?.job_position}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />
      <TextareaRow
        name="qualifications_required"
        label="Qualifications Required"
        placeholder="B.C.A / M.C.A under National University course complete.&#x0a;3 or more years of professional design experience. &#x0a;have already graduated or are currently in any year of study etc."
        formData={formData}
        setFormData={setFormData}
        value={formData?.qualifications_required}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        numberOfLines={7}
      />

      <TextareaRow
        name="job_responsibilities"
        label="Job Responsibilities"
        placeholder="To Handle Employees. &#x0a;To Create Office Budgets. &#x0a;To Deal with Clients."
        formData={formData}
        setFormData={setFormData}
        value={formData?.job_responsibilities}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <TextareaRow
        name="skills_and_experience"
        label="Skills And Experience"
        placeholder="Good Communication Skills. &#x0a;Good Team Player. &#x0a;Good Time Management Skills."
        formData={formData}
        setFormData={setFormData}
        value={formData?.skills_and_experience}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <TextInputRow
        name="search_keywords"
        label="Search Keywords*"
        placeholder="e.g. manager job, software engineer job, web development job, etc"
        formData={formData}
        setFormData={setFormData}
        value={formData?.search_keywords}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />
    </View>
  );
}
