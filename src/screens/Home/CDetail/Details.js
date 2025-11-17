import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IconRow} from '../../../components/Common';
import {addHttps, getWorkingDays} from '../../../utils';
import style from '../../../theme/style';
import {Colors} from '../../../theme/color';

const Details = ({company}) => {
  const isClosed = item => {
    return item?.toLowerCase()?.includes('close') || false;
  };

  return (
    <View>
      <IconRow
        name="Website"
        image={require('../../../../assets/image/web.png')}
        value={addHttps(company?.website_url)}
        linking={true}
      />

      <IconRow
        name="Employees"
        image={require('../../../../assets/image/teamwork.png')}
        value={company?.total_employees}
      />

      <IconRow
        name="Address"
        image={require('../../../../assets/image/s18.png')}
        value={company?.company_address}
      />

      <View style={styles.boxContainer}>
        <Text
          style={[
            style.m18,
            {color: Colors.txt, marginBottom: 15, marginTop: 0},
          ]}>
          Working Days
        </Text>

        {getWorkingDays(company?.working_days)?.map((item, index) => (
          <View
            key={`${index}-working_days`}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
            <Text style={[style.r14, {color: Colors.txt}]}>{item[0]}</Text>
            <Text
              style={[
                style.r14,
                {
                  color: isClosed(item[1]) ? Colors.red : Colors.txt,
                },
              ]}>
              {item[1]}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.boxContainer}>
        <Text style={[style.m18, {color: Colors.txt}]}>About Company</Text>

        <Text style={[style.r14, {color: '#313131', marginTop: 5}]}>
          {company?.company_details || 'No details available.'}
        </Text>
      </View>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  boxContainer: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.divider,
    marginTop: 30,
    position: 'relative',
  },
});
