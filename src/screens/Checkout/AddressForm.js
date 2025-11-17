import {View} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import TextInputRow from '../../components/TextInputRow';
import {useDispatch, useSelector} from 'react-redux';
import {getParsedJson, showError} from '../../utils';
import TextareaRow from '../../components/TextareaRow';
import {checkoutApiSlice} from '../api-slices/checkout-api-slice';
import {setCheckoutResponse} from '../users-slice';

const AddressForm = forwardRef((props, ref) => {
  const {selectedPlan, setLoading, setCurrentStep, companies} = props;

  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;
  const dispatch = useDispatch();

  const [purchasePlan] = checkoutApiSlice.usePurchasePlanMutation();

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const customerAdditional = getParsedJson(customer?.additional_fields, null);

  const initial_state = {
    name: customer?.name || '',
    email: customer?.email || '',
    additional_mobile_number: customer?.mobile_number || '',
    address: customerAdditional?.permanent_address || '',
    city: customerAdditional?.city || '',
  };

  const [formData, setFormData] = useState(initial_state);

  useEffect(() => {
    if (companies?.length) {
      const company = companies[0];

      setFormData(prevData => ({
        ...prevData,
        name: company?.name,
        additional_mobile_number:
          company?.contact_number || company?.mobile_number,
        address: company?.address,
        gst_number: company?.gst_number,
      }));
    }
  }, [companies]);

  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    if (!formData.name) {
      setErrors({name: 'Please enter your name'});
      return;
    }

    if (!formData.email) {
      setErrors({email: 'Please enter email'});
      return;
    }

    if (!formData.additional_mobile_number) {
      setErrors({mobile_number: 'Please enter phone number'});
      return;
    }

    if (!formData.address) {
      setErrors({address: 'Please enter billing address'});
      return;
    }

    if (!formData.city) {
      setErrors({city: 'Please enter city'});
      return;
    }

    try {
      setLoading(true);
      const payload = {
        plan_id: parseInt(selectedPlan?.id, 10),
        items: [],
        customer: formData,
      };

      const response = await purchasePlan(payload).unwrap();

      if (response?.order?.id) {
        setCurrentStep(2);

        dispatch(setCheckoutResponse(response));
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInputRow
        name="name"
        label="Company Name / Your Name*"
        placeholder="Enter Name"
        formData={formData}
        setFormData={setFormData}
        value={formData?.name}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

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
      />

      <TextInputRow
        name="mobile_number"
        label="Phone number*"
        placeholder="Enter Phone number"
        formData={formData}
        setFormData={setFormData}
        value={formData?.additional_mobile_number}
        v="v2"
        errors={errors}
        setErrors={setErrors}
        keyboardType="number-pad"
      />

      <TextareaRow
        name="address"
        label="Your Address / Company Address*"
        placeholder="Enter Address"
        formData={formData}
        setFormData={setFormData}
        value={formData?.address}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <TextInputRow
        name="city"
        label="City*"
        placeholder="Enter City Name"
        formData={formData}
        setFormData={setFormData}
        value={formData?.city}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />

      <TextInputRow
        name="gst_number"
        label="GST Number (Optional)"
        placeholder="Enter GST Number"
        formData={formData}
        setFormData={setFormData}
        value={formData?.gst_number}
        v="v2"
        errors={errors}
        setErrors={setErrors}
      />
    </View>
  );
});

export default AddressForm;
