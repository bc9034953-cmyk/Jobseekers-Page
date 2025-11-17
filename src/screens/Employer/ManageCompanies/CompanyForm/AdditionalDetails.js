import {View} from 'react-native';
import React from 'react';
import TextInputRow from '../../../../components/TextInputRow';
import Selector from '../../../../components/Selector';
import TextareaRow from '../../../../components/TextareaRow';
import Configs from '../../../../utils/Configs';

export default function AdditionalDetails({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const companyTypes = Object.keys(Configs.COMPANY_TYPES)?.map(key => ({
    id: Configs.COMPANY_TYPES[key],
    title: Configs.COMPANY_TYPES[key],
  }));

  return (
    <View>
      <TextInputRow
        name="owner_name"
        label="Owner Name"
        placeholder="Enter company owner name"
        formData={formData}
        setFormData={setFormData}
        value={formData?.owner_name}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <Selector
        placeholder="Select Company Type"
        label="Company Type"
        data={companyTypes}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        name="company_type"
        value={formData?.company_type}
        alphabeticalOrder={false}
      />

      <TextInputRow
        name="contact_number"
        label="Phone Number"
        placeholder="Enter Phone Number"
        formData={formData}
        setFormData={setFormData}
        value={formData?.contact_number}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        keyboardType="number-pad"
      />

      <TextInputRow
        name="total_employees"
        label="Total Employees"
        placeholder="Total Employees"
        formData={formData}
        setFormData={setFormData}
        value={formData?.total_employees?.toString()}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        keyboardType="number-pad"
      />

      <TextInputRow
        name="establishment_year"
        label="Establishment Year"
        placeholder="Establishment Year"
        formData={formData}
        setFormData={setFormData}
        value={formData?.establishment_year?.toString()}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        keyboardType="number-pad"
      />

      <TextInputRow
        name="gst_number"
        label="GST Number"
        placeholder="GST Number"
        formData={formData}
        setFormData={setFormData}
        value={formData?.gst_number}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <TextInputRow
        name="website_url"
        label="Website Url"
        placeholder="Website Url"
        formData={formData}
        setFormData={setFormData}
        value={formData?.website_url}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        autoCapitalize="none"
        keyboardType="url"
      />

      <TextareaRow
        name="map_location"
        label="Map Location"
        placeholder="Map Location"
        formData={formData}
        setFormData={setFormData}
        value={formData?.map_location}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <TextareaRow
        name="working_days"
        label="Working Days"
        placeholder="Working Days"
        formData={formData}
        setFormData={setFormData}
        value={formData?.working_days}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />
    </View>
  );
}
