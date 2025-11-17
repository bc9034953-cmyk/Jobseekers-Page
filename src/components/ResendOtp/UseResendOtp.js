import { useState, useEffect, useRef, useCallback } from 'react';
import { usersApiSlice } from '../../screens/users-api-slice';
import { showError, showSuccess, detectLoginMethod } from '../../utils';

const useResendOTP = ({
  maxTime = 60,
  onTimerComplete,
  timeInterval = 1000,
  onResendClick,
  email,
  mobile,
  setResendLoading,
}) => {
  const timeout = useRef();
  const [remainingTime, setRemainingTime] = useState(maxTime);

  const [resendOtp] = usersApiSlice.useResendOtpMutation();
  const [resendMobileOtp] = usersApiSlice.useResendMobileOtpMutation();

  useEffect(() => {
    if (timeout.current && remainingTime === 0) {
      clearTimeout(timeout.current);
      if (onTimerComplete) {
        onTimerComplete();
      }
    } else {
      timeout.current = setTimeout(() => {
        setRemainingTime(t => t - 1);
      }, timeInterval);
    }
    return () => {
      clearTimeout(timeout.current);
    };
  }, [onTimerComplete, remainingTime, timeInterval]);

  const handelResendClick = useCallback(async () => {
    setResendLoading(true);
    if (onResendClick) {
      onResendClick(remainingTime === 0);
    }

    try {
      const username = email || mobile;

      if (!username) {
        throw new Error('Unable to send the OTP!');
      }

      const loginMethod = detectLoginMethod(username);
      let response;

      if (loginMethod === 'email') {
        response = await resendOtp({ email: username }).unwrap();
      } else {
        response = await resendMobileOtp({ mobile_number: username }).unwrap();
      }

      if (response?.message) {
        showSuccess(response?.message);
        setRemainingTime(maxTime);
      }
    } catch (error) {
      showError(error);
      console.log('error::', error);
    } finally {
      setResendLoading(false);
    }
  }, [
    setResendLoading,
    onResendClick,
    resendOtp,
    resendMobileOtp,
    email,
    mobile,
    remainingTime,
    maxTime,
  ]);

  return {
    handelResendClick,
    remainingTime,
  };
};

export default useResendOTP;
