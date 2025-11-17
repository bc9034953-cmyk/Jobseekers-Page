import {View} from 'react-native';
import React, {useState} from 'react';
import PaymentGatewayList from './PaymentGatewayList';
import PaymentButton from './PaymentButton';
import {useDispatch, useSelector} from 'react-redux';
import {setCheckoutResponse} from '../../users-slice';
import {useNavigation} from '@react-navigation/native';

const PaymentGateways = ({setCurrentGateway, currentGateway}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const checkoutRedirectPath = useSelector(
    state => state.users.checkoutRedirectPath,
  );

  console.log('checkoutRedirectPath 2222::', checkoutRedirectPath);

  const orderDone = () => {
    dispatch(setCheckoutResponse({}));
    navigation.navigate('Success', {
      title: 'Congratulations on Your Purchase!',
      description: 'Your credits have been successfully added to your account.',
      btnText: checkoutRedirectPath?.name ? 'Continue' : 'Go to Dashboard',
      btnLink: checkoutRedirectPath?.name || 'Account',
      redirectParams: checkoutRedirectPath?.params || {},
    });
  };

  return (
    <View>
      <PaymentGatewayList
        setCurrentGateway={setCurrentGateway}
        setLoading={setLoading}
      />

      {!loading && (
        <PaymentButton currentGateway={currentGateway} orderDone={orderDone} />
      )}
    </View>
  );
};

export default PaymentGateways;
