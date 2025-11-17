import {useState, useEffect} from 'react';

const scoreData = {
  name: 10,
  company_details: 10,
  company_address: 10,
  job_location_id: 10,
  mobile_number: 10,
  logo: 5,
  owner_name: 5,
  total_employees: 5,
  contact_number: 2,
  establishment_year: 3,
  gst_number: 5,
  map_location: 5,
  working_days: 5,
  company_type: 2,
  email_address: 10,
  website_url: 5,
};

const useCompanyProfileCompletion = companyDetails => {
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    const formData = {
      logo: companyDetails?.logo,
      name: companyDetails?.name,
      company_details: companyDetails?.company_details,
      owner_name: companyDetails?.owner_name,
      total_employees: companyDetails?.total_employees,
      establishment_year: companyDetails?.establishment_year,
      company_type: companyDetails?.company_type,
      working_days: companyDetails?.working_days,
      map_location: companyDetails?.map_location,
      contact_number: companyDetails?.contact_number,
      mobile_number: companyDetails?.mobile_number,
      email_address: companyDetails?.email_address,
      website_url: companyDetails?.website_url,
      company_address: companyDetails?.company_address,
      job_location_id: companyDetails?.job_location_id,
      gst_number: companyDetails?.gst_number,
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
  }, [companyDetails]);

  return completionPercentage;
};

export default useCompanyProfileCompletion;
