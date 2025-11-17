import React, {useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import Button from '../../components/Button';
import TextInputRow from '../../components/TextInputRow';
import TextareaRow from '../../components/TextareaRow';
import {getSettingByKey, showError, showSuccess} from '../../utils';
import ScreenLayout from '../ScreenLayout';
import {baseApi} from '../baseApi';
import Recaptcha from 'react-native-recaptcha-that-works';
import Configs from '../../utils/Configs';
import {useSelector} from 'react-redux';

export default function ContactUs() {
  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;

  const initialState = {
    name: customer?.name,
    email_address: customer?.email,
    subject: '',
    message: '',
    captcha_value: 'N/A',
  };

  const recaptcha = useRef();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [captcha, setCaptcha] = useState('');

  const {data: frontendSettings} = baseApi.useGetFrontendSettingsQuery();

  const google_recaptcha_site_key = getSettingByKey(
    frontendSettings,
    'google_recaptcha_site_key',
  )?.value;

  const [contactQuery, {isLoading}] = baseApi.useContactQueryMutation();

  const handleApiCall = async () => {
    try {
      const response = await contactQuery({
        ...formData,
        captcha_value: captcha,
      }).unwrap();

      showSuccess('Message sent successfully.');
      setFormData(initialState);

      console.log('response::', response);
    } catch (error) {
      showError(error);
    }
  };

  const handleSubmit = async () => {
    if (!formData?.name) {
      setErrors({name: 'Please enter your name'});
      return;
    }

    if (!formData?.email_address) {
      setErrors({email_address: 'Please enter email address'});
      return;
    }

    if (!formData?.subject) {
      setErrors({subject: 'Please enter a subject'});
      return;
    }

    if (!formData?.message) {
      setErrors({message: 'Please enter your message'});
      return;
    }

    recaptcha.current.open();
  };

  const onVerify = token => {
    setCaptcha(token);
    handleApiCall();
    console.log('captcha verified');
  };

  const onExpire = () => {
    console.warn('captcha expired!');
  };

  return (
    <ScreenLayout title="Contact Us">
      <ScrollView showsVerticalScrollIndicator={false}>
        <TextInputRow
          name="name"
          label="Name*"
          placeholder="Enter Your Name"
          formData={formData}
          setFormData={setFormData}
          value={formData?.name}
          v="v2"
          errors={errors}
          setErrors={setErrors}
        />

        <TextInputRow
          name="email_address"
          label="Email*"
          keyboardType="email-address"
          placeholder="Enter Email Address"
          formData={formData}
          setFormData={setFormData}
          value={formData?.email_address}
          v="v2"
          errors={errors}
          setErrors={setErrors}
        />

        <TextInputRow
          name="subject"
          label="Subject*"
          placeholder="Enter Your Subject"
          formData={formData}
          setFormData={setFormData}
          value={formData?.subject}
          v="v2"
          errors={errors}
          setErrors={setErrors}
        />

        <TextareaRow
          name="message"
          label="Your Message"
          placeholder="Enter your Message"
          formData={formData}
          setFormData={setFormData}
          value={formData?.message}
          v="v2"
          errors={errors}
          setErrors={setErrors}
        />

        {google_recaptcha_site_key && (
          <Recaptcha
            ref={recaptcha}
            siteKey={google_recaptcha_site_key}
            baseUrl={Configs.WEBSITE_URL}
            onVerify={onVerify}
            onExpire={onExpire}
            onError={err => console.warn(err)}
            size="normal"
          />
        )}

        <Button
          styles={{marginTop: 30}}
          onPress={handleSubmit}
          isLoading={isLoading}>
          Send Message
        </Button>
      </ScrollView>
    </ScreenLayout>
  );
}
