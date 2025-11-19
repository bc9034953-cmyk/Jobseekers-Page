
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import Configs from './Configs';
import { Alert, Linking, ToastAndroid } from 'react-native';
import axios from 'axios';
import RNFS from 'react-native-fs';

export function apiHeaders(headers, getState) {
  // By default, if we have a token in the store, let's use that for authenticated requests
  const token = getState()?.users?.authToken;
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }
  return headers;
}

export function removeCache(key) {
  AsyncStorage.removeItem(key);
}

export const convertToSlug = text => {
  return (
    text &&
    text
      ?.toLowerCase()
      ?.replace(/[^\w ]+/g, '')
      ?.replace(/ +/g, '-')
  );
};

// get time stamp in seconds
export function getTimestampInSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function getFileExtension(fileName) {
  if (fileName) {
    const a = fileName?.split('.');
    if (a.length === 1 || (a[0] === '' && a.length === 2)) {
      return '';
    }
    return a.pop();
  }
  return '';
}

export function setCache(key, string) {
  AsyncStorage.setItem(key, string);
}

export function setJsonCache(key, object) {
  setCache(key, JSON.stringify(object));
}

export function showSuccess(message, duration = 2000) {
  showMessage({
    message: typeof message === 'string' ? message : 'Success.',
    type: 'success',
    floating: true,
    icon: 'success',
    duration,
  });
}

export function getErrorMessage(err) {
  let message = err;

  if (err?.data && err?.data[0]?.message) {
    message = err?.data[0]?.message;
  } else if (err?.data?.message) {
    message = err?.data?.message;
  } else if (err?.message) {
    message = err?.message;
  }

  return message;
}

export const credentialError = error => {
  if (
    typeof error === 'string' &&
    (error?.includes('Your request was made with invalid credentials') ||
      error?.data?.name === 'Unauthorized')
  ) {
    return 'Please log in to your account to continue with your request.';
  }
};

export const getUnreadNotifications = data => {
  if (Array.isArray(data)) {
    return data?.filter(item => item.is_viewed === 0);
  }

  return [];
};

export function showError(
  err,
  duration = 4000,
  navigation,
  showToastMessage,
  position = 'bottom',
) {
  let message = getErrorMessage(err);

  if (credentialError(message)) {
    message = credentialError(message);
    if (navigation) {
      navigation.navigate('Login');
    }
  }

  if (showToastMessage) {
    ToastAndroid.show(
      typeof message === 'string' ? message : 'Something went wrong.',
      ToastAndroid.SHORT,
    );
  } else {
    showMessage({
      message: typeof message === 'string' ? message : 'Something went wrong.',
      type: 'danger',
      floating: true,
      icon: 'warning',
      duration,
      position: position,
      style: {
        zIndex: 10000,
      },
    });
  }
}

export const getAllLocalStorageData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);

    // items is an array of [key, value] pairs.
    let allStorageData = {};
    items.forEach(keyValue => {
      const key = keyValue[0];
      const value = keyValue[1];
      allStorageData[key] = value;
    });
    return allStorageData;
  } catch (error) {
    console.error('Error retrieving local storage data', error);
  }
};

export const isValidMobile = val => {
  if (/^\d{10}$/.test(val)) {
    return true;
  } else {
    return false;
  }
};

export function validateEmail(value) {
  if (!value) {
    return 'Enter an email address';
  }
  if (!/^\S+@\S+$/.test(value)) {
    return 'Enter a valid email address';
  }
  return null;
}

export function validateUsername(username) {
  // Check if the username is a string
  if (typeof username !== 'string') {
    return 'Username must be a string.';
  }

  // Check if the username is between 6 and 30 characters long
  if (username.length < 6 || username.length > 30) {
    return 'Username must be between 6 and 30 characters long.';
  }

  // Check if the username contains only alphanumeric characters and underscores
  var validCharacters = /^[a-zA-Z0-9_]+$/;
  if (!validCharacters.test(username)) {
    return 'Username must contain only alphanumeric characters and underscores.';
  }

  // If all checks pass, the username is valid
  return '';
}

export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const getParsedJson = (json, defaultValue = '{}') => {
  let parsedJson = defaultValue;

  try {
    if (isJsonString(json)) {
      parsedJson = JSON.parse(json ?? defaultValue);
    }

    if (isJsonString(parsedJson)) {
      parsedJson = JSON.parse(parsedJson ?? defaultValue);
    }
  } catch (error) {
    parsedJson = JSON.parse(defaultValue);
  }

  return parsedJson;
};

export function isPlanExpired(expiryDate) {
  // Parse the expiry date string into a Date object
  const expiration = new Date(expiryDate);
  // Get the current date and time
  const now = new Date();
  // Check if the current date is after the expiry date
  return now > expiration;
}

export function getTimeBasedGreeting() {
  // Obtain the current hour using the Date object.
  const currentHour = new Date().getHours();

  // Determine the time of day and set the appropriate greeting.
  if (currentHour < 6) {
    return 'Good Night';
  } else if (currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour < 17) {
    return 'Good Afternoon';
  } else if (currentHour < 21) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
}

export function getFirstCharacters(fullName) {
  if (fullName && fullName.length > 0) {
    const names = fullName.split(' ');
    let initials = '';
    for (let i = 0; i < names.length && initials.length < 2; i++) {
      const name = names[i];
      if (name && name.length > 0) {
        initials += name.charAt(0).toUpperCase();
      }
    }
    return initials;
  }
  return null; // return null if no full name is provided or the full name is an empty string
}

export const getWorkExpText = (total_work_experience, suffix = 'years') => {
  if (!total_work_experience) {
    return null;
  }
  return `${total_work_experience} ${
    total_work_experience !== 'Fresher' ? suffix : ''
  }`;
};

export function displayAmount(number = 0) {
  // Convert the number to a string for easy manipulation
  let numStr = number.toString();

  // Check the length of the number string
  let length = numStr.length;

  if (length > 3) {
    // Split the number into two parts: before and after the last 3 digits
    let mainPart = numStr.slice(0, -3);
    let lastThreeDigits = numStr.slice(-3);

    // Create an array to store the main part split into groups of two digits
    let formattedMainPart = [];
    while (mainPart.length > 2) {
      formattedMainPart.unshift(mainPart.slice(-2));
      mainPart = mainPart.slice(0, -2);
    }

    // Add what's left of the mainPart
    if (mainPart.length > 0) {
      formattedMainPart.unshift(mainPart);
    }

    // Join the main part with commas and append the last three digits
    return formattedMainPart.join(',') + ',' + lastThreeDigits;
  } else {
    // If the number is less than or equal to 3 digits, return as-is
    return numStr;
  }
}

export const getSalaryAmount = (job, suffix = 'month', showIcon = true) => {
  let minSalary = 0;

  if (!job) {
    return null;
  }

  // const minSalary = parseInt(job?.minimum_salary_per_month, 10);
  if (job?.minimum_salary_per_month) {
    minSalary = parseInt(job?.minimum_salary_per_month, 10);
  } else {
    minSalary = job;
  }

  return `₹${displayAmount(minSalary)} / ${suffix}`;
};

export const getCompanyLogo = (logo, size = '120x120') => {
  const sizePrefix = size ? `${size}-` : '';

  if (logo) {
    return { uri: `${Configs.DATA_URL}/jobcompanies/${sizePrefix}${logo}` };
  } else {
    return require('../../assets/image/company-logo.png');
  }
};

export const getUserImage = (image, size = '120x120') => {
  const sizePrefix = size ? `${size}-` : '';

  if (image) {
    return { uri: `${Configs.DATA_URL}/customers/${sizePrefix}${image}` };
  } else {
    return require('../../assets/image/user.png');
  }
};

export function loggedInWithin30Days(lastLoginDateString) {
  const lastLoginDate = new Date(lastLoginDateString);
  const currentDate = new Date();

  const difference = currentDate - lastLoginDate;
  const differenceInDays = difference / (1000 * 3600 * 24);

  return differenceInDays <= 30;
}

// it is used to make the given string into array by splitting using the given separator.
export const toArray = (value, separator) => {
  let arr = [];

  if (value) {
    arr = value
      .split(separator)
      .filter(Boolean)
      .map(v => v.trim())
      .filter(v => v !== '');
  }
  return arr;
};

export const getSettingByKey = (settings, keyName, defaultValue) =>
  settings?.find(setting => setting.key === keyName) || defaultValue;

export const getJobExperiences = (job, suffix = 'Years') => {
  const minExp = parseInt(job?.minimum_experience_required, 10);
  const maxExp = parseInt(job?.maximum_experience_required, 10);

  if (minExp === 0 && maxExp === 0) {
    return 'Exp Not required';
  }

  if (minExp === 0) {
    return 'Exp Not required';
  }

  if (minExp <= 1) {
    suffix = 'Year';
  }

  return `${minExp} ${suffix}`;
};

export const getJobTypeChipColor = type => {
  const lowercasedType = type?.toLowerCase();
  switch (lowercasedType) {
    case 'full time':
      return '#DC2626'; // Red - prominent and important
    case 'part time':
      return '#3B82F6'; // Blue - balanced and flexible
    case 'freelancer':
      return '#8B5CF6'; // Purple - creative and independent
    case 'temporary':
      return '#F59E0B'; // Amber - temporary/contract work
    case 'internship':
      return '#06B6D4'; // Cyan - learning and growth
    default:
      return '#6B7280'; // Gray - neutral fallback
  }
};

export const getLocationById = (locations, id) => {
  const parsedId = parseInt(id, 10);

  if (!id) {
    return 'India';
  }

  // If id is not a number after parseInt, return 'id'
  if (isNaN(parsedId)) {
    return id;
  } else {
    // Otherwise, proceed to find the location with the matching id
    return (
      locations?.find(location => location?.id === parsedId)?.name || 'India'
    );
  }
};

export async function attachFile(path, formData, token, onProgress) {
  try {
    const response = await axios.post(`${Configs.API_URL}${path}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      // onUploadProgress: progressEvent => {
      //   let percentCompleted = Math.floor(
      //     (progressEvent.loaded * 100) / progressEvent.total,
      //   );
      //   onProgress(percentCompleted);
      // },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getFirstChar = word => {
  return word?.charAt(0).toUpperCase() ?? '';
};

export const renderMonth = value => {
  switch (value) {
    case '01':
      return 'Jan';
    case '02':
      return 'Feb';
    case '03':
      return 'Mar';
    case '04':
      return 'Apr';
    case '05':
      return 'May';
    case '06':
      return 'Jun';
    case '07':
      return 'Jul';
    case '08':
      return 'Aug';
    case '09':
      return 'Sep';
    case '10':
      return 'Oct';
    case '11':
      return 'Nov';
    case '12':
      return 'Dec';
    default:
      return '';
  }
};

export const getJobsByType = (jobs, type) => {
  if (type === 'recent jobs') {
    return jobs;
  }

  return jobs?.filter(job => job?.job_type?.toLowerCase() === type) || [];
};

export const getUserPayload = userData => {
  const customer = userData?.customer;
  const additionalDetails = getParsedJson(customer?.additional_fields);

  const payload = {
    id: customer?.id,
    name: customer?.name || '',
    email: customer?.email || '',
    mobile_number: customer?.mobile_number || '',
    AdditionalFields: {
      details: additionalDetails?.details || '',
      languages_known: additionalDetails?.languages_known || '',
      skills: additionalDetails?.skills || '',
      location: additionalDetails?.location || '',
      designation: additionalDetails?.designation || '',
      current_salary_per_month:
        additionalDetails?.current_salary_per_month || '',
      expected_salary_per_month:
        additionalDetails?.expected_salary_per_month || '',
      facebook_url: additionalDetails?.facebook_url || '',
      twitter_url: additionalDetails?.twitter_url || '',
      linkedin_url: additionalDetails?.linkedin_url || '',
      whatsapp_number: additionalDetails?.whatsapp_number || '',
      profile_picture: additionalDetails?.profile_picture || '',

      resume: additionalDetails?.resume || '',
      cover_letter: additionalDetails?.cover_letter || '',
      resume_size: additionalDetails?.resume_size?.toString() || '',
      cover_letter_size: additionalDetails?.cover_letter_size?.toString() || '',
      profile_completion_percentage:
        additionalDetails?.profile_completion_percentage?.toString() || '',

      hobbies: additionalDetails?.hobbies || '',
      permanent_address: additionalDetails?.permanent_address || '',
      present_address: additionalDetails?.present_address || '',
      state: additionalDetails?.state || '',
      same_as_permanent_address:
        additionalDetails?.same_as_permanent_address || '',
    },
  };

  return payload;
};

export function titleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

export function isUserEmployer(userData) {
  return userData?.customer?.customer_type === 1;
}

export const addHttps = url => {
  if (typeof url !== 'string' || url === null || url.trim() === '') {
    console.log('Invalid URL::');
    return '';
  }

  return url.trim().startsWith('http') || url.trim().startsWith('https')
    ? url
    : `https://${url}`;
};

export const isInsufficientCreditError = message =>
  message === 'No credits available.' ||
  message === 'Your credits are expired' ||
  message === 'You do not have enough credits to see this candidate profile.';

export const scrollTo = (scrollRef, top) => {
  if (!scrollRef) {
    return false;
  }
  scrollRef.current?.scrollTo({
    y: top,
    animated: true,
  });
};

export const getWorkingDays = string => {
  const items = [];
  const list = toArray(string, '\n');
  list?.forEach(element => items.push(toArray(element, '=>')));
  return items;
};

export function isEmailVerified(data) {
  return data?.customer?.is_email_verified === 1;
}

export function isMobileVerified(data) {
  return data?.customer?.is_mobile_verified === 1;
}

export function humanReadableSize(bytes) {
  let size = parseInt(bytes, 10);
  for (let unit of ['b', 'Kb', 'Mb', 'Gb']) {
    if (size < 1024) {
      return `${size.toFixed(1)} ${unit}`;
    }
    size /= 1024.0;
  }
}

export function showPermissionSettingsAlert(
  msg = 'This app requires access to your gallery and camera.',
) {
  Alert.alert(
    'Permissions Required',
    `${msg} Please enable them in your device settings.`,
    [
      {
        text: 'Go to Settings',
        onPress: () => Linking.openSettings(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    { cancelable: false },
  );
}

export async function fileSaver(
  apiUrl,
  fileName,
  setLoading,
  token,
  setDownloadProgress,
  actualFileSizeBytes,
) {
  setLoading(true);

  try {
    const downloadDir = RNFS.DownloadDirectoryPath;
    const jobSeekersPageDir = `${downloadDir}/JobSeekersPage`;

    // Check if download directory exists
    const dirExists = await RNFS.exists(downloadDir);
    if (!dirExists) {
      await RNFS.mkdir(downloadDir);
    }

    // Check if JobSeekersPage directory exists and create if it doesn't
    const jobSeekersDirExists = await RNFS.exists(jobSeekersPageDir);
    if (!jobSeekersDirExists) {
      await RNFS.mkdir(jobSeekersPageDir);
    }

    // Construct the full file path in the JobSeekersPage directory
    const filePath = `${jobSeekersPageDir}/${fileName}`;

    // Use RNFS.downloadFile to handle the download with progress support
    const downloadOptions = {
      fromUrl: apiUrl,
      toFile: filePath,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      background: true, // Optional: run download in the background
      begin: res => {
        console.log('Download has started', res);
      },
      progress: res => {
        if (setDownloadProgress) {
          const progressPercent =
            (res.bytesWritten / actualFileSizeBytes) * 100;
          setDownloadProgress(Math.floor(progressPercent)); // Update progress in percentage
        }
      },
    };

    const downloadResult = RNFS.downloadFile(downloadOptions);

    // Check download status
    const result = await downloadResult.promise;

    if (result.statusCode === 200) {
      showSuccess(`File has been saved in "${filePath}"`, 10000);
      console.log(`Successfully downloaded ${fileName} to ${filePath}`);
    } else {
      throw new Error(
        `Failed to download ${fileName}: Unexpected status code ${result.statusCode}`,
      );
    }
  } catch (err) {
    showError('Error while downloading file!');
    console.error('Error during file download:', err);
  } finally {
    setLoading(false);
    setDownloadProgress(0); // Reset progress once download is complete or failed
  }
}

export function validateMobileNumber(mobileNumber) {
  // Check if mobile number is provided
  if (!mobileNumber || !mobileNumber.trim()) {
    return 'Mobile number is required.';
  }

  // Check if mobile number is a valid number
  const mob_regex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;

  if (!mob_regex.test(mobileNumber)) {
    return 'Please enter a valid mobile number.';
  }

  return '';
}

export function detectLoginMethod(input) {
  if (!input) {
    return null;
  }

  // Check if it's a valid email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(input)) {
    return 'email';
  }

  // Check if it's a valid mobile number using existing validateMobileNumber function
  const mobileValidation = validateMobileNumber(input);
  if (mobileValidation === '') {
    return 'mobile_number';
  }

  return null;
}

export function getTimeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const seconds = diffInSeconds;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

// is user active in last 7 days
export function isUserActive(dateString) {
  if (!dateString) return false;
  const now = new Date();
  const past = new Date(dateString);
  const diffInDays = Math.floor((now - past) / (1000 * 60 * 60 * 24));

  return diffInDays <= 7;
}
