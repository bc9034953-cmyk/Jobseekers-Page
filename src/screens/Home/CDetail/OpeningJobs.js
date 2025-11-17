import {Text, View} from 'react-native';
import React from 'react';
import {jobsApiSlice} from '../../api-slices/jobs-api-slice';
import SingleJobItem from '../../../components/SingleJobItem';
import AppLoader from '../../../components/AppLoader';
import style from '../../../theme/style';

const OpeningJobs = ({company}) => {
  const {data: jobs, isLoading} = jobsApiSlice.useGetJobsQuery({
    page: 1,
    'per-page': 1000,
  });

  const currentCompanyJobs = jobs?.filter(
    job => job?.company?.id === company?.id,
  );

  if (isLoading) {
    return <AppLoader />;
  }

  if (currentCompanyJobs?.length === 0) {
    return (
      <View style={{paddingVertical: 80}}>
        <Text style={[style.m14, {textAlign: 'center'}]}>
          No opening jobs are available on this company.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {currentCompanyJobs?.map(job => (
        <SingleJobItem key={`job-${job?.id}`} job={job} />
      ))}
    </View>
  );
};

export default OpeningJobs;
