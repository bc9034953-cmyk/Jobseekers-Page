import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import style from '../../theme/style';
import {Colors} from '../../theme/color';
import {ProgressBar} from 'react-native-paper';
import useProfileCompletion from './useProfileCompletion';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {isUserEmployer} from '../../utils';

export default function ProfileMeter({showButton}) {
  const completionPercentage = useProfileCompletion();
  const navigation = useNavigation();

  const userData = useSelector(state => state.users.data);
  const authToken = userData?.token;

  if (completionPercentage === 100 || !authToken || isUserEmployer(userData)) {
    return null;
  }

  return (
    <View style={styles.boxContainer}>
      <Text style={[style.m13, {color: Colors.txt}]}>
        <Text style={[style.b18, {fontSize: 25, color: Colors.txt}]}>
          {completionPercentage}%{' '}
        </Text>
        of your profile is completed
      </Text>
      <ProgressBar
        progress={completionPercentage / 100}
        style={{height: 8, borderRadius: 5, backgroundColor: Colors.bord}}
        color={Colors.primary}
      />

      <Text style={[style.r12, {marginTop: 10}]}>
        Complete your profile to get started. the more you complete the profile
        the chance will increase for getting a better job.
      </Text>

      {showButton && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Profile')}>
          <Text style={[style.m12, {color: Colors.primary}]}>
            Complete profile
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.divider,
    marginTop: 20,
    position: 'relative',
  },
  button: {
    borderColor: Colors.primary,
    borderWidth: 1,
    width: 140,
    paddingVertical: 5,
    borderRadius: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});
