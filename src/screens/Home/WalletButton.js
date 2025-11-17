import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { usersApiSlice } from '../users-api-slice';
import { isUserEmployer } from '../../utils';
import style from '../../theme/style';

const WalletButton = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const userData = useSelector(state => state.users.data);

  const {
    data: planDetails,
    refetch,
    isUninitialized,
    isLoading: isPlanLoading,
    error,
  } = usersApiSlice.useGetPlanDetailsQuery(
    {},
    {
      skip: !isUserEmployer(userData),
    },
  );

  const isPlanExpired = planDetails?.is_expired;
  const balance = planDetails?.balance || 0;
  const hasPlan =
    planDetails && Object.keys(planDetails).length > 0 && !error?.data?.message;
  const shouldRedirectToPricing = !hasPlan || balance === 0;

  useEffect(() => {
    if (isFocused && !isUninitialized) {
      refetch();
    }
  }, [refetch, isFocused, isUninitialized]);

  const getCreditText = creditBalance => {
    if (creditBalance === 1) return 'credit';
    return 'credits';
  };

  const getWalletContent = () => {
    if (isPlanLoading) {
      return (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar1} />
          <View style={styles.loadingBar2} />
        </View>
      );
    }

    if (!hasPlan) {
      return (
        <View style={styles.walletContent}>
          <Text style={styles.balanceTextWhite}>No Plan</Text>
          <Text style={styles.subTextWhite}>Get Started</Text>
        </View>
      );
    }

    if (isPlanExpired) {
      return (
        <View style={styles.walletContent}>
          <Text style={[styles.balanceTextWhite, { fontSize: 12 }]}>
            {balance || 0}
          </Text>
          <Text style={styles.subTextWhite}>Expired</Text>
        </View>
      );
    }

    return (
      <View style={styles.walletContent}>
        <Text
          style={[
            styles.balanceText,
            { fontSize: 12, ...(balance === 0 && { color: Colors.white }) },
          ]}>
          {balance || 0}
        </Text>
        <Text
          style={[
            styles.subText,
            { ...(balance === 0 && { color: Colors.white }) },
          ]}>
          {getCreditText(balance)}
        </Text>
      </View>
    );
  };

  const getBackgroundStyle = () => {
    if (isPlanLoading) return styles.walletIconLoading;
    if (!hasPlan || balance === 0 || isPlanExpired)
      return styles.walletIconDanger;
    return styles.walletIcon;
  };

  const getIconColor = () => {
    if (isPlanLoading) return Colors.active;
    if (!hasPlan || balance === 0 || isPlanExpired) return Colors.white;
    return Colors.primary;
  };

  const handlePress = () => {
    if (shouldRedirectToPricing) {
      navigation.navigate('Pricing');
    } else {
      navigation.navigate('Account');
    }
  };

  if (!isUserEmployer(userData)) {
    return null;
  }

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginLeft: 15 }}>
      <View style={getBackgroundStyle()}>
        <Icon name="wallet" size={22} color={getIconColor()} />
        <View style={styles.walletInfo}>{getWalletContent()}</View>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  walletIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  walletIconDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: Colors.red,
  },
  walletIconLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  walletInfo: {
    marginLeft: 6,
  },
  walletContent: {
    flexDirection: 'column',
  },
  balanceText: {
    ...style.b12,
    color: Colors.primary,
    fontSize: 9,
    lineHeight: 10,
  },
  subText: {
    ...style.r10,
    color: Colors.primary,
    fontSize: 8,
    lineHeight: 10,
    marginTop: 1,
  },
  balanceTextWhite: {
    ...style.b12,
    color: Colors.white,
    fontSize: 9,
    lineHeight: 10,
  },
  subTextWhite: {
    ...style.r10,
    color: Colors.white,
    fontSize: 8,
    lineHeight: 10,
    marginTop: 1,
  },
  loadingContainer: {
    flexDirection: 'column',
  },
  loadingBar1: {
    width: 20,
    height: 10,
    backgroundColor: Colors.divider,
    borderRadius: 2,
    marginBottom: 2,
  },
  loadingBar2: {
    width: 28,
    height: 6,
    backgroundColor: Colors.divider,
    borderRadius: 2,
  },
};

export default WalletButton;
