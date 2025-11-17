import {Text, View} from 'react-native';
import React from 'react';
import useCompanyProfileCompletion from '../../../Account/useCompanyProfileCompletion';
import {ProgressBar} from 'react-native-paper';
import {Colors} from '../../../../theme/color';

export default function CompanyProfileMeter({companyDetails}) {
  const compCompletion = useCompanyProfileCompletion(companyDetails);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}>
        <Text>Profile completion </Text>
        <Text>{compCompletion}%</Text>
      </View>

      <ProgressBar
        progress={compCompletion / 100}
        style={{height: 5, borderRadius: 5}}
        color={Colors.primary}
      />
    </View>
  );
}
