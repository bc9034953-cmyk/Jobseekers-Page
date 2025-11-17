import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {checkoutApiSlice} from '../../api-slices/checkout-api-slice';
import {Colors} from '../../../theme/color';
import RadioForm from 'react-native-simple-radio-button';
import style from '../../../theme/style';
import {ActivityIndicator} from '@react-native-material/core';

const {height} = Dimensions.get('window');

const PaymentGatewayList = ({setCurrentGateway, setLoading}) => {
  const [radioPaymentGateways, setRadioPaymentGateways] = useState([]);
  const [initialGatewayIndex, setInitialGatewayIndex] = useState(null);
  const {
    data: paymentGateways,
    isLoading,
    error,
  } = checkoutApiSlice.useGetPaymentGatewaysQuery();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (paymentGateways?.length) {
      const defaultGateway =
        paymentGateways?.find(gateway => gateway.is_default === 1) ?? {};

      setCurrentGateway(defaultGateway);

      const defaultGatewayIndex = paymentGateways?.findIndex(object => {
        return object.id === defaultGateway.id;
      });
      setInitialGatewayIndex(defaultGatewayIndex);

      const gatewayList = [];

      paymentGateways?.map(e => {
        const environment = e?.environment === 'sandbox' ? ' (Sandbox)' : '';
        return gatewayList.push({
          label: e.name + environment,
          value: e.name,
        });
      });

      setRadioPaymentGateways(gatewayList);
    }
  }, [paymentGateways, setCurrentGateway]);

  const changeMethod = method => {
    const filterCurrentGateway = paymentGateways.find(e => e.name === method);
    setCurrentGateway(filterCurrentGateway);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderWrapper}>
        <ActivityIndicator color={Colors.primary} size={'large'} />
      </View>
    );
  }

  if (error) {
    return (
      <>
        <Text style={[style.m14, {color: Colors.txt, marginBottom: 10}]}>
          Payment Methods
        </Text>

        <View style={styles.boxContainer}>
          <Text>Something went wrong while loading Payment Gateway</Text>
        </View>
      </>
    );
  }

  return (
    <View>
      <Text style={[style.m14, {color: Colors.txt, marginBottom: 10}]}>
        Payment {radioPaymentGateways.length > 1 ? 'Methods' : 'Method'}
      </Text>

      <View style={styles.boxContainer}>
        {radioPaymentGateways && radioPaymentGateways.length > 0 && (
          <RadioForm
            radio_props={radioPaymentGateways}
            initial={initialGatewayIndex}
            onPress={value => changeMethod(value)}
            style={{margin: 10, marginLeft: 5}}
            animation={true}
            buttonSize={12}
            buttonOuterSize={25}
            buttonColor={Colors.primary}
            selectedButtonColor={Colors.primary}
            buttonWrapStyle={{marginBottom: 20, backgroundColor: 'red'}}
            buttonStyle={{marginBottom: 20}}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    padding: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.divider,
    marginHorizontal: 2,
    backgroundColor: Colors.white,
  },
  container: {
    backgroundColor: Colors.white,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 8,
    paddingVertical: 20,
  },
  loaderWrapper: {
    minHeight: height / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default PaymentGatewayList;
