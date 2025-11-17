import React from 'react';
import PropTypes from 'prop-types';
import UseResendOtp from './UseResendOtp';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {Colors} from '../../theme/color';

function ResendOTP({
  renderTime,
  renderButton,
  style,
  className,
  email,
  mobile,
  ...props
}) {
  const {remainingTime, handelResendClick} = UseResendOtp({
    ...props,
    email,
    mobile,
  });

  return (
    <>
      <View style={styles.resend}>
        {remainingTime === 0 ? (
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text
              style={{
                color: Colors.txt2,
                marginRight: 4,
                fontSize: 13,
                fontFamily: 'Poppins-Medium',
              }}>
              Didn't recieve the OTP?
            </Text>
            <TouchableOpacity onPress={handelResendClick}>
              <Text
                style={{
                  fontSize: 13,
                  color: Colors.primary,
                  textDecorationLine: 'underline',
                  fontFamily: 'Poppins-Medium',
                }}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.timerSec}>
            <Text style={styles.text}>You can resend the OTP in</Text>
            <Entypo
              name="stopwatch"
              size={15}
              style={{marginRight: 3, marginTop: -5}}
              color={Colors.txt}
            />
            <Text style={styles.text}>{remainingTime || 0} secs</Text>
          </View>
        )}
      </View>
    </>
  );
}

ResendOTP.defaultProps = {
  maxTime: 30,
  timeInterval: 1000,
  style: {},
};

ResendOTP.propTypes = {
  onTimerComplete: PropTypes.func,
  onResendClick: PropTypes.func,
  renderTime: PropTypes.func,
  renderButton: PropTypes.func,
  maxTime: PropTypes.number,
  timeInterval: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
};

const styles = StyleSheet.create({
  resend: {
    marginBottom: 15,
  },
  timerSec: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
    color: Colors.txt2,
    fontFamily: 'Poppins-Medium',
  },
});

export default ResendOTP;
