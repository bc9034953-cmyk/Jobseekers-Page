import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, ScrollView, View} from 'react-native';
import Button from '../../components/Button';
import PlanItem from '../Pricing/PlanItem';
import ScreenLayout from '../ScreenLayout';
import CustomStepIndicator from './CustomStepIndicator';
import AddressForm from './AddressForm';
import PaymentGateways from './PaymentGateways';
import {baseApi} from '../baseApi';
import {companiesApiSlice} from '../api-slices/companies-api-slice';
import {useSelector} from 'react-redux';

export default function Checkout(props) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Selected Plan', 'Billing Address', 'Payment'];
  const [currentGateway, setCurrentGateway] = useState({});

  const userData = useSelector(state => state.users.data);
  let {data: companies} = companiesApiSlice.useGetCompaniesQuery({
    'JobCompaniesSearch[employer_id]': userData?.customer?.id,
  });

  const params = props?.route?.params;

  const {data: plans} = baseApi.useGetPlansQuery();

  const selectedPlan = plans?.find(plan => plan?.id === params?.planId);

  useEffect(() => {
    // if selected plan is not available then navigating to the previous screen
    if (!selectedPlan && props.navigation) {
      props.navigation.goBack();
    }
  }, [props, selectedPlan]);

  const [loading, setLoading] = useState(false);

  const addressFormRef = useRef(null);

  const handleExternalSubmit = () => {
    if (addressFormRef.current) {
      addressFormRef.current.handleSubmit();
    }
  };

  const handleNextButton = () => {
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleExternalSubmit();
    }
  };

  useEffect(() => {
    const onBackPress = () => {
      if (currentStep > 0) {
        setCurrentStep(prevStep => prevStep - 1);
        return true;
      }
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Cleanup function to remove the event listener
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [currentStep]);

  const renderActiveStepBody = () => {
    if (currentStep === 0) {
      return <PlanItem plan={selectedPlan} isTouchable={false} />;
    }

    if (currentStep === 1) {
      return (
        <AddressForm
          ref={addressFormRef}
          setLoading={setLoading}
          setCurrentStep={setCurrentStep}
          selectedPlan={selectedPlan}
          companies={companies}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <PaymentGateways
          currentGateway={currentGateway}
          setCurrentGateway={setCurrentGateway}
        />
      );
    }
  };

  return (
    <ScreenLayout title="Checkout" backScreen="Pricing">
      <View style={{flex: 1}}>
        <CustomStepIndicator
          currentStep={currentStep}
          labels={steps}
          setCurrentStep={setCurrentStep}
        />

        <ScrollView
          style={{marginTop: 20}}
          contentContainerStyle={{paddingBottom: 30}}
          showsVerticalScrollIndicator={false}>
          {renderActiveStepBody()}
        </ScrollView>
      </View>

      {currentStep < 2 && (
        <>
          <Button
            isLoading={loading}
            styles={{marginVertical: 10}}
            onPress={handleNextButton}>
            Next
          </Button>
        </>
      )}
    </ScreenLayout>
  );
}
