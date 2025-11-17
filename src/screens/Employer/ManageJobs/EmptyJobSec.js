import React from 'react';
import {Image, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Button from '../../../components/Button';
import {Colors} from '../../../theme/color';
import style from '../../../theme/style';

const EmptyJobSec = ({showButton = true, handlePostJob = () => {}}) => {
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

      <Text style={[style.b18, {color: Colors.txt}]}>
        Time to Grow Your Team!
      </Text>

      <Text
        style={[
          style.r14,
          {
            textAlign: 'center',
            color: Colors.txt,
            opacity: 0.8,
          },
        ]}>
        Ready to find your next team member? Post your job now and start
        connecting with talented candidates!
      </Text>

      {showButton && (
        <Button
          onPress={handlePostJob}
          v="v2"
          icon={<Entypo name="plus" size={20} color={Colors.white} />}
          styles={{marginTop: 20}}>
          Post a new job
        </Button>
      )}
    </View>
  );
};

export default EmptyJobSec;
