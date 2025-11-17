import {baseApi} from '../../baseApi';
import {getSettingByKey, getWorkExpText, toArray} from '../../../utils';

const useFiltersData = () => {
  const {data: frontendSettings} = baseApi.useGetFrontendSettingsQuery();

  const workExperienceList = toArray(
    getSettingByKey(frontendSettings, 'total_work_experiences')?.value,
    '\n',
  );

  const workExperienceData = workExperienceList?.map(item => ({
    id: item,
    name: getWorkExpText(item),
  }));

  const salaryRangeList = toArray(
    getSettingByKey(frontendSettings, 'salary_range')?.value,
    '\n',
  );

  const salaryRangeData = salaryRangeList?.map(item => ({
    id: item,
    name: `₹${item}`,
  }));

  const jobTypeList = toArray(
    getSettingByKey(frontendSettings, 'job_types')?.value,
    '\n',
  );

  const jobTypeData = jobTypeList?.map(item => ({
    id: item,
    name: item,
  }));

  return {workExperienceData, salaryRangeData, jobTypeData};
};

export default useFiltersData;
