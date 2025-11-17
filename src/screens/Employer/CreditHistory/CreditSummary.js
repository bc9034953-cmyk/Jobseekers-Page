import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../../../theme/color';
import style from '../../../theme/style';
import {useNavigation} from '@react-navigation/native';

export default function CreditSummary({planDetails}) {
  const isRunningLow = planDetails?.balance < 0;
  const navigation = useNavigation();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 30}}>
      <View style={styles.mainContainer}>
        <View style={styles.col}>
          <Text style={styles.valueCol}>{planDetails?.credits || 0}</Text>
          <Text style={styles.lableCol}>Total Credit Purchased</Text>
        </View>

        <View style={styles.col}>
          <Text style={styles.valueCol}>{planDetails?.debits || 0}</Text>
          <Text style={styles.lableCol}>Credit Used</Text>
        </View>

        <View style={[styles.col]}>
          <Text style={styles.valueCol}>{planDetails?.balance || 0}</Text>
          <Text style={styles.lableCol}>Credit Balance</Text>
        </View>

        {isRunningLow && (
          <View style={styles.lowCreditContainer}>
            <Text style={styles.lowCreditTitle}>Credit Running Low!</Text>
            <Text style={styles.lowCreditDescription}>
              Your credit balance is running low. Please purchase more credits
              to continue using the services without interruption.
            </Text>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => navigation.navigate('Pricing')}>
              <Text style={styles.buyButtonText}>Buy Credits</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 15,
    borderRadius: 7,
  },
  col: {
    paddingVertical: 15,
    padding: 10,
    minHeight: 50,
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    marginBottom: 10,
  },

  colDivider: {
    borderRightWidth: 1,
    borderRightColor: Colors.divider,
    height: 40,
  },
  lableCol: {
    ...style.m14,
    color: Colors.txt,
  },
  valueCol: {
    ...style.m22,
    color: Colors.primary,
  },
  lowCreditContainer: {
    backgroundColor: '#ffefef',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcccc',
    alignItems: 'center',
    marginTop: 20,
  },
  lowCreditTitle: {
    ...style.m18,
    color: '#d9534f',
    marginBottom: 10,
  },
  lowCreditDescription: {
    ...style.r14,
    color: '#d9534f',
    textAlign: 'center',
    marginBottom: 15,
  },
  buyButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 7,
    borderRadius: 20,
    marginBottom: 8,
  },
  buyButtonText: {
    ...style.m14,
    color: '#fff',
  },
});
