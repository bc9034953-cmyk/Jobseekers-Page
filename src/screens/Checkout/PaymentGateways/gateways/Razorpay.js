import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import {Colors} from '../../../../theme/color';

const width = Dimensions.get('window').width;

const Razorpay = ({
  onPaymentFailed,
  createPayment,
  onPaymentSuccess,
  isVerifying,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const payNow = useCallback(async () => {
    try {
      setIsLoading(true);
      let orderResponse = await createPayment();

      if (orderResponse?.order) {
        if (orderResponse?.order?.order_error_message) {
          onPaymentFailed({
            reason: orderResponse?.order?.order_error_message,
          });
        } else {
          const options = {
            description: 'Checkout',
            image:
              'https://jobseekerspage.com/backend/data/banners/1695282316-joblogo.png',
            currency: orderResponse?.order?.currency_code ?? 'INR',
            key: orderResponse?.settings?.api_details?.api_key,
            amount: parseInt(orderResponse?.order?.total_amount, 10) * 100,
            name: 'Jobseekerspage.com',
            order_id: orderResponse?.order?.payment_gateway_order_id,
            //  created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
            prefill: {
              contact: orderResponse?.customer?.mobile_number,
              name: orderResponse?.customer?.name,
            },
            theme: {color: Colors.primary},
          };

          const rzr = await RazorpayCheckout.open(options);

          if (rzr?.razorpay_order_id) {
            onPaymentSuccess(orderResponse?.order?.order_id, rzr);
            setIsLoading(false);
          }
        }
      } else {
        throw new Error('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.log('err::', err);

      setIsLoading(false);
      onPaymentFailed({
        reason:
          err?.error?.description ?? 'Something went wrong. Please try again.',
      });
    }
  }, [createPayment, onPaymentFailed, onPaymentSuccess]);

  let button = (
    <TouchableOpacity style={styles.btn} onPress={_ => payNow()}>
      <Text style={styles.btnText}>Pay Using Razorpay</Text>
    </TouchableOpacity>
  );

  if (isLoading || isVerifying) {
    button = (
      <View style={[styles.btn, {...styles.btnLoading}]}>
        <ActivityIndicator color={Colors.white} />
        <Text style={[styles.btnText]}>
          {isVerifying ? 'Verifying payment' : 'Loading'}
        </Text>
      </View>
    );
  }

  return <>{button}</>;
};

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 18,
    paddingHorizontal: 45,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
    width: width - 40,
    alignSelf: 'center',
    marginBottom: 30,
  },
  btnText: {
    color: Colors.white,
  },
  btnLoading: {
    gap: 5,
    opacity: 0.6,
  },
});

export default Razorpay;
