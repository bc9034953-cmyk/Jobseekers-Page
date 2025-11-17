class Configs {
  static API_URL = 'https://jobseekerspage.com/backend/api/web/';
  static DATA_URL = 'https://jobseekerspage.com/backend/data';
  static WEBSITE_URL = 'https://jobseekerspage.com/backend/data';
  static USER_DATA_STORAGE_KEY = 'jobseekers_user_data';
  static USER_TYPE_STORAGE_KEY = 'jobseekers_user_type';
  static RECENTLY_VIEWED_JOBS_STORAGE_KEY =
    'jobseekers_recently_viewed_jobs_key';
  static RECENTLY_VIEWED_CANDIDATES_STORAGE_KEY =
    'jobseekers_recently_viewed_candidates_key';

  static COMPANY_TYPES = {
    PUBLIC: 'Public',
    PRIVATE: 'Private',
    NGO: 'NGO',
    MNC: 'MNC',
    CORPORATE: 'Corporate',
    STARTUP: 'Startup',
    OTHER: 'Other',
  };

  static EMPLOYMENT_TYPES = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    FREELANCER: 'Freelancer',
    TEMPORARY: 'Temporary',
    INTERNSHIP: 'Internship',
  };
}

export default Configs;
