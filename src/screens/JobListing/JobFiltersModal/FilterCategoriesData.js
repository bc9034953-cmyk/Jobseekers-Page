export const filterTabMenus = [
  {id: 'job_location_id', title: 'Location'},
  {id: 'job_category_id', title: 'Industry'},
  {id: 'work_experience', title: 'Experience'},
  {id: 'job_type', title: 'Job Type'},
  {id: 'salary_range', title: 'Salary Range'},
  {id: 'created_within_hours', title: 'Date Posted'},
  {id: 'search_keywords', title: 'Job Keywords'},
];

export const datePostedData = [
  {id: 'All', name: 'All'},
  {id: '1', name: 'Last Hour'},
  {id: '24', name: 'Last 24 hours'},
  {id: '168', name: 'Last 7 days'},
];

// TODO: remove this, because we are getting this filter values from the admin panel.
export const experienceData = [
  {id: 'All', name: 'All'},
  {id: '0-3', name: '0-3 years'},
  {id: '3-6', name: '3-6 years'},
  {id: '6-100', name: 'More than 6 years'},
];

// TODO: remove this, because we are getting this filter values from the admin panel.
export const jobTypeData = [
  {id: 'Freelance', name: 'Freelance'},
  {id: 'Full Time', name: 'Full Time'},
  {id: 'Internship', name: 'Internship'},
  {id: 'Part Time', name: 'Part Time'},
];

// TODO: remove this, because we are getting this filter values from the admin panel.
export const salaryRangeData = [
  {id: 'all', name: 'All'},
  {id: '0-5000', name: 'Rs.0-5000'},
  {id: '5000-15000', name: 'Rs.5000-15000'},
  {id: '15000-30000', name: 'Rs.15000-30000'},
  {id: '30000-50000', name: 'Rs.30000-50000'},
  {id: '50000-80000', name: 'Rs.50000-80000'},
  {id: '80000-100000', name: 'Rs.80000-100000'},
  {id: '100000+', name: 'Rs.100000+'},
];
