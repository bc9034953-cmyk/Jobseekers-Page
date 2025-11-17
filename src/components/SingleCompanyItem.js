import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../theme/color';
import style from '../theme/style';
import {getCompanyLogo} from '../utils';
import Feather from 'react-native-vector-icons/Feather';
import useGetJobLocation from './useGetJobLocation';

export default function SingleCompanyItem({details, jobTimeText = 'Posted'}) {
  const navigation = useNavigation();
  const {getLocation} = useGetJobLocation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('CDetail', {id: details?.id})}
      style={styles.card}>
      <Image
        source={getCompanyLogo(details?.logo)}
        resizeMode="stretch"
        defaultSource={require('../../assets/image/company-logo.png')}
        style={{height: 55, width: 55, borderRadius: 8}}
      />
      <View style={{marginLeft: 15, flex: 1}}>
        <Text style={[style.s16, {color: Colors.active}]}>{details?.name}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Image
            source={require('../../assets/image/s21.png')}
            resizeMode="stretch"
            style={{height: 20, width: 20, tintColor: Colors.primary}}
          />
          <Text style={[style.m14, {color: '#212121', marginLeft: 8}]}>
            {details?.total_employees || 0}{' '}
            {details?.total_employees > 1 ||
            details?.total_employees?.includes('-') ||
            details?.total_employees?.includes('+')
              ? 'employees'
              : 'employee'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Image
            source={require('../../assets/image/s19.png')}
            resizeMode="stretch"
            style={{height: 20, width: 20, tintColor: Colors.primary}}
          />
          <Text style={[style.m14, {color: '#212121', marginLeft: 8}]}>
            {getLocation(details?.job_location_id) || 'India'}
          </Text>
        </View>

        <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('ManageJobs', {companyId: details?.id})
            }>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{details?.open_job_count}</Text>
            </View>
            <Text style={[style.m13, styles.tabText]}>View Opening Jobs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('CompanyForm', {details})}>
            <Feather name="edit" color={Colors.txt} size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginTop: 15,
    paddingBottom: 20,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  button: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 30,
    paddingHorizontal: 17,
    backgroundColor: '#ebe9fd',
    maxWidth: 170,
    width: 'auto',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    lineHeight: 18,
    color: Colors.txt,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: 0,
    backgroundColor: Colors.red,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
  },
  editBtn: {
    backgroundColor: '#ebe9fd',
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
