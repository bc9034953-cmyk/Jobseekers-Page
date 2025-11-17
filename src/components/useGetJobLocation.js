import {jobsApiSlice} from '../screens/api-slices/jobs-api-slice';

export default function useGetJobLocation() {
  const {data: jobLocations} = jobsApiSlice.useGetJobLocationsQuery();

  const getLocation = id => {
    const location = jobLocations?.find(item => item?.id === parseInt(id, 10));
    return location?.name || 'India';
  };

  const getLocationObj = id => {
    const location = jobLocations?.find(item => item?.id === parseInt(id, 10));

    return location;
  };

  return {getLocation, getLocationObj};
}
