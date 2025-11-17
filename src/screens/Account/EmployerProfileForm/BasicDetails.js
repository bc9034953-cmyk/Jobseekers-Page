import React, {useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import TextInputRow from '../../../components/TextInputRow';
import {Colors} from '../../../theme/color';
import style from '../../../theme/style';
import ChangeLoginFieldModal from '../../../components/ChangeLoginFieldModal';

export default function BasicDetails({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const [openChangeEmailModal, setOpenChangeEmailModal] = useState(false);
  const [openChangeMobileModal, setOpenChangeMobileModal] = useState(false);

  const handleChangeEmail = () => {
    setOpenChangeEmailModal(true);
  };

  const handleChangeMobile = () => {
    setOpenChangeMobileModal(true);
  };

  const handleEmailChangeSuccess = newEmail => {
    setFormData(prev => ({...prev, email: newEmail}));
  };

  const handleMobileChangeSuccess = newMobile => {
    setFormData(prev => ({...prev, mobile_number: newMobile}));
  };

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

      <View style={{marginBottom: 20}}>
        <View style={{flexDirection: 'row', alignItems: 'end'}}>
          <View style={{flex: 1}}>
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
            <Text style={[style.r13, {color: Colors.primary}]}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{marginBottom: 20}}>
        <View style={{flexDirection: 'row', alignItems: 'end'}}>
          <View style={{flex: 1}}>
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
            <Text style={[style.r13, {color: Colors.primary}]}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    </View>
  );
}
