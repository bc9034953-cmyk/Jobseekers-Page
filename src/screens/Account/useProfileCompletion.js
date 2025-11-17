import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {getParsedJson} from '../../utils';

const scoreData = {
  name: 3,
  username: 3,
  email: 3,
  mobile_number: 3,
  details: 2,
  languages_known: 2,
  location: 3,
  designation: 3,
  current_salary_per_month: 3,
  expected_salary_per_month: 1,
  skills: 2,
  facebook_url: 1,
  twitter_url: 1,
  linkedin_url: 1,
  whatsapp_number: 1,
  profile_picture: 3,
  resume: 3,
  cover_letter: 1,
  hobbies: 2,
  permanent_address: 2,
  present_address: 2,
  state: 2,
};

const useProfileCompletion = () => {
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;
  const customerAdditional = getParsedJson(customer?.additional_fields, null);

  useEffect(() => {
    const formData = {
      name: customer?.name || '',
      username: customer?.username || '',
      email: customer?.email || '',
      mobile_number: customer?.mobile_number || '',
      details: customerAdditional?.details || '',
      languages_known: customerAdditional?.languages_known || '',
      location: customerAdditional?.location || '',
      designation: customerAdditional?.designation || '',
      current_salary_per_month:
        customerAdditional?.current_salary_per_month || '',
      expected_salary_per_month:
        customerAdditional?.expected_salary_per_month || '',
      skills: customerAdditional?.skills || '',
      facebook_url: customerAdditional?.facebook_url || '',
      twitter_url: customerAdditional?.twitter_url || '',
      linkedin_url: customerAdditional?.linkedin_url || '',
      whatsapp_number: customerAdditional?.whatsapp_number || '',
      profile_picture: customerAdditional?.profile_picture || '',
      hobbies: customerAdditional?.hobbies || '',
      permanent_address: customerAdditional?.permanent_address || '',
      present_address: customerAdditional?.present_address || '',
      state: customerAdditional?.state || '',
      resume: customerAdditional?.resume || '',
      cover_letter: customerAdditional?.cover_letter || '',
    };

    const totalScore = Object.values(scoreData).reduce(
      (acc, value) => acc + value,
      0,
    );

    let completedFields = 0;

    if (formData) {
      for (const field in scoreData) {
        if (formData[field] && formData[field] !== '') {
          completedFields += scoreData[field];
        }
      }
    }

    const percentage = ((completedFields / totalScore) * 100).toFixed(0);
    setCompletionPercentage(parseInt(percentage, 10));
  }, [customer, customerAdditional]);

  return completionPercentage;
};

export default useProfileCompletion;
