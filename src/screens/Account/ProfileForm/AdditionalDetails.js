import { Text, View } from 'react-native';
import React from 'react';
import TextInputRow from '../../../components/TextInputRow';
import TextareaRow from '../../../components/TextareaRow';
import { Divider } from '@react-native-material/core';
import style from '../../../theme/style';
import { Colors } from '../../../theme/color';

export default function AdditionalDetails({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  return (
    <View>
      <TextareaRow
        name="details"
        label="Introduce Yourself"
        placeholder="Introduce Yourself"
        formData={formData}
        setFormData={setFormData}
        value={formData?.details}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <TextareaRow
        name="permanent_address"
        label="Permanent Address"
        placeholder="Permanent Address"
        formData={formData}
        setFormData={setFormData}
        value={formData?.permanent_address}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <TextareaRow
        name="present_address"
        label="Present Address"
        placeholder="Present Address"
        formData={formData}
        setFormData={setFormData}
        value={formData?.present_address}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <Divider style={{ marginTop: 20 }} />

      <Text
        style={[
          style.m16,
          { color: Colors.txt, marginTop: 15, marginLeft: 5 },
        ]}>
        Social Media
      </Text>

      <TextInputRow
        name="facebook_url"
        label="Facebook"
        placeholder="Your Facebook URL"
        formData={formData}
        setFormData={setFormData}
        value={formData?.facebook_url}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <TextInputRow
        name="linkedin_url"
        label="Linkedin"
        placeholder="Your Linkedin URL"
        formData={formData}
        setFormData={setFormData}
        value={formData?.linkedin_url}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <TextInputRow
        name="whatsapp_number"
        label="Whatsapp"
        placeholder="Your Whatsapp Number"
        formData={formData}
        setFormData={setFormData}
        value={formData?.whatsapp_number}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        keyboardType="number-pad"
      />
    </View>
  );
}
