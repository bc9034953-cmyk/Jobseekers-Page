import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Button from '../../../components/Button';
import {Colors} from '../../../theme/color';
import style from '../../../theme/style';

const EmptyCompanySec = ({showButton = true}) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 70,
      }}>
      <Image
        source={require('../../../../assets/image/job.png')}
        style={{width: 65, height: 65, marginBottom: 15}}
      />

      <Text style={[style.b18, {color: Colors.txt}]}>Add a new company</Text>

      <Text
        style={[
          style.r14,
          {
            textAlign: 'center',
            color: Colors.txt,
            opacity: 0.8,
          },
        ]}>
        You haven't created a company profile yet. Click below to get started
        and hire exceptional candidates.
      </Text>

      {showButton && (
        <Button
          onPress={() => navigation.navigate('CompanyForm')}
          v="v2"
          icon={<Entypo name="plus" size={20} color={Colors.white} />}
          styles={{marginTop: 20}}>
          Add a new company
        </Button>
      )}
    </View>
  );
};

export default EmptyCompanySec;
