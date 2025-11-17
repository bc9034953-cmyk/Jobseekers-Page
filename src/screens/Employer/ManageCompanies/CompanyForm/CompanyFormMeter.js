import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import style from '../../../../theme/style';
import {Colors} from '../../../../theme/color';
import {ProgressBar} from 'react-native-paper';
import {useSelector} from 'react-redux';

export default function CompanyFormMeter({completionPercentage}) {
  const userData = useSelector(state => state.users.data);
  const authToken = userData?.token;

  if (completionPercentage === 100 || !authToken) {
    return null;
  }

  return (
    <View style={styles.boxContainer}>
      <Text style={[style.m13, {color: Colors.txt}]}>
        <Text style={[style.m13, {color: Colors.txt}]}>
          {completionPercentage}%{' '}
        </Text>
        of your profile is completed
      </Text>

      <View style={{backgroundColor: '#e8dfea', marginTop: 5, borderRadius: 5}}>
        <ProgressBar
          progress={completionPercentage / 100}
          style={{
            height: 8,
            borderRadius: 5,
            backgroundColor: Colors.bord,
          }}
          color={Colors.primary}
        />
      </View>

      <Text style={[style.r12, {marginTop: 10}]}>
        The more updated profile, the more chances of getting more profiles as
        per requirement
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.divider,
    marginTop: 10,
    position: 'relative',
  },
  button: {
    borderColor: Colors.primary,
    borderWidth: 1,
    width: 130,
    paddingVertical: 5,
    borderRadius: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});
