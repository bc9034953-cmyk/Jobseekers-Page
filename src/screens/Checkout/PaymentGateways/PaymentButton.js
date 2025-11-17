import React, {useCallback} from 'react';
import {View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useSelector} from 'react-redux';
import Razorpay from './gateways/Razorpay';
import {checkoutApiSlice} from '../../api-slices/checkout-api-slice';

const PaymentButton = ({
  currentGateway,
  onPaymentFailureHandler,
  onPaymentSuccessHandler,
  orderDone,
}) => {
  const checkoutResponse = useSelector(state => state?.users?.checkoutResponse);
  const [verifyPayment, {isLoading}] =
    checkoutApiSlice.useVerifyPaymentMutation();
  const [createPaymentApi] = checkoutApiSlice.useCreatePaymentApiMutation();

  const gateways = {
    razorpay: Razorpay,
  };

  const handleError = error => {
    if (onPaymentFailureHandler) {
      onPaymentFailureHandler(error);
    } else {
      showMessage({
        message: error.reason,
        type: 'danger',
        duration: 3000,
        hideOnPress: true,
        floating: true,
      });
    }
  };

  const onPaymentSuccess = async (orderId, response) => {
    try {
      let verificationResponse = await verifyPayment({
        order_id: orderId,
        payload: response,
      }).unwrap();

      if (verificationResponse?.payment_status === 'Failed') {
        throw new Error(
          verificationResponse?.payment_verification_error_message,
        );
      }

      if (onPaymentSuccessHandler) {
        onPaymentSuccessHandler(orderId);
      } else {
        orderDone();
      }
    } catch (e) {
      console.log(e);
      handleError({
        reason: e?.message ?? 'Payment Failed. Please try again.',
      });
    }
  };

  const onPaymentFailed = error => {
    handleError(error);
  };

  const createPayment = useCallback(async () => {
    let data = {};
    try {
      let response = await createPaymentApi({
        id: checkoutResponse?.order?.id,
        payment_gateway: currentGateway?.internal_name,
        payment_gateway_environment: currentGateway?.environment,
      }).unwrap();
      data = response;
    } catch (e) {
      console.log(e);
    } finally {
    }
    return data;
  }, [checkoutResponse?.order?.id, createPaymentApi, currentGateway]);

  const getPaymentGatewayButton = currentPaymentGateway => {
    if (currentPaymentGateway?.internal_name) {
      const Component = gateways[currentPaymentGateway.internal_name];
      return (
        <Component
          currentGateway={currentPaymentGateway}
          createPayment={createPayment}
          checkoutResponse={checkoutResponse}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentFailed={onPaymentFailed}
          isVerifying={isLoading}
        />
      );
    }
  };

  let button = getPaymentGatewayButton(currentGateway);
  return <View>{button}</View>;
};

export default PaymentButton;
