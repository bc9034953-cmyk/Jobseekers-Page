import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import style from '../../theme/style';
import { Colors } from '../../theme/color';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { isUserEmployer } from '../../utils';
import { usersApiSlice } from '../users-api-slice';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
const { width } = Dimensions.get('window');

export default function CreditMeter({ showButton }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const userData = useSelector(state => state.users.data);

  const {
    data: planDetails,
    refetch,
    isUninitialized,
    error,
  } = usersApiSlice.useGetPlanDetailsQuery(
    {},
    {
      skip: !isUserEmployer(userData),
    },
  );

  const plan = planDetails?.plan;
  const isPlanExpired = planDetails?.is_expired;

  const creditUsedPercentage =
    (planDetails?.debits / planDetails?.credits) * 100;
  const isCreditFinished = planDetails?.balance <= 0;

  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (isFocused && !isUninitialized) {
      refetch();
    }
  }, [refetch, isFocused, isUninitialized]);

  const getExpiryDateText = () => {
    const expiryDate = moment(planDetails?.credits_expiry_date).format(
      'MMMM DD, YYYY',
    );
    if (isPlanExpired) {
      return (
        <Text style={[style.r12, { color: Colors.red }]}>
          Your credits are expired on{' '}
          <Text style={[style.s12, { color: Colors.red }]}>{expiryDate}</Text>,
          If you want to continue using the credits, please renew your plan.
        </Text>
      );
    }

    return (
      <Text style={[style.r12, { color: Colors.txt2 }]}>
        Your credits are available till <Text>{expiryDate}</Text>
      </Text>
    );
  };

  if (!isUserEmployer(userData)) {
    return null;
  }

  // Show no plan card if no plan exists
  if (!planDetails?.credits || error?.data?.message) {
    return (
      <View style={styles.noPlanContainer}>
        <View style={styles.noPlanContent}>
          <View style={styles.noPlanIconContainer}>
            <MaterialIcons
              name="credit-card"
              size={32}
              color={Colors.primary}
            />
          </View>
          <Text style={styles.noPlanTitle}>No Active Plan</Text>
          <Text style={styles.noPlanText}>
            Get unlimited job postings and access to our full candidate
            database.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.noPlanButton}
          onPress={() => navigation.navigate('Pricing')}>
          <MaterialIcons
            name="shopping-cart"
            size={16}
            color={Colors.white}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.noPlanButtonText}>View Plans</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.boxContainer}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={style.m13}>Current Plan</Text>

        {isPlanExpired ? (
          <Text style={[style.r10, styles.expiredText]}>Expired</Text>
        ) : (
          <Text style={[style.r10, styles.activeText]}>Active</Text>
        )}
      </View>
      <Text style={[style.m15, { color: Colors.txt }]}>
        {plan?.name || 'Custom Plan'}
      </Text>

      <TouchableWithoutFeedback onPress={() => setIsCollapsed(!isCollapsed)}>
        <View style={styles.actionIcon}>
          <EntypoIcons
            name={`chevron-${isCollapsed ? 'down' : 'up'}`}
            color={Colors.txt}
          />
        </View>
      </TouchableWithoutFeedback>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <Text style={[style.m13, { color: Colors.txt }]}>
          <Text style={[style.b18, { fontSize: 25, color: Colors.txt }]}>
            {plan?.total_credits || planDetails?.credits}{' '}
          </Text>
          credits
        </Text>

        {isPlanExpired && (
          <TouchableOpacity
            style={[styles.button, { borderColor: Colors.red, marginTop: 0 }]}
            onPress={() => navigation.navigate('Pricing')}>
            <Text style={[style.m12, { color: Colors.red }]}>Renew Plan</Text>
          </TouchableOpacity>
        )}
      </View>

      {!isCollapsed && (
        <View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View>
              <Text style={styles.text1}>{planDetails?.debits || 0}</Text>
              <Text style={[style.r13]}>credits used</Text>
            </View>

            <View>
              <Text style={styles.text1}>{planDetails?.balance || 0}</Text>
              <Text style={[style.r13]}>
                credits {isPlanExpired ? 'expired' : 'available'}
              </Text>
            </View>
          </View>

          <ProgressBar
            progress={creditUsedPercentage / 100}
            style={{
              height: 8,
              borderRadius: 5,
              marginBottom: 12,
              backgroundColor: isPlanExpired ? Colors.red2 : Colors.bord,
            }}
            color={
              Colors[isCreditFinished || isPlanExpired ? 'red' : 'primary']
            }
          />

          <View style={styles.row}>
            <View style={{ width: width - 190 }}>
              <Text style={[style.r13, { marginTop: 8, marginBottom: 3 }]}>
                Total credits purchased
              </Text>
              <Text style={styles.text1}>{planDetails?.credits}</Text>
            </View>

            {showButton && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('CreditHistory')}>
                <Text style={[style.m12, { color: Colors.primary }]}>
                  View details
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ marginTop: 10 }}>{getExpiryDateText()}</View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    padding: 14,
    paddingBottom: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.divider,
    marginTop: 20,
    position: 'relative',
  },
  button: {
    borderColor: Colors.primary,
    borderWidth: 1,
    width: 100,
    paddingVertical: 5,
    borderRadius: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  text1: {
    ...style.m15,
    color: Colors.txt,
    lineHeight: 18,
  },
  actionIcon: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 15,
    top: 12,
  },
  expiredText: {
    color: Colors.red,
    backgroundColor: Colors.red + '30',
    paddingHorizontal: 8,
    paddingVertical: 0,
    borderRadius: 12,
    marginLeft: 10,
    lineHeight: 22,
  },
  noPlanContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  noPlanContent: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  noPlanIconContainer: {
    backgroundColor: Colors.bg2,
    borderRadius: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  noPlanTitle: {
    ...style.m14,
    color: Colors.txt,
    marginBottom: 4,
    textAlign: 'left',
  },
  noPlanText: {
    ...style.r12,
    color: Colors.txt2,
    lineHeight: 16,
    textAlign: 'left',
  },
  noPlanButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  noPlanButtonText: {
    ...style.m12,
    color: Colors.white,
  },
  activeText: {
    color: Colors.darkGreen,
    backgroundColor: Colors.darkGreen + '30',
    paddingHorizontal: 8,
    paddingVertical: 0,
    borderRadius: 12,
    marginLeft: 10,
    lineHeight: 22,
  },
});
