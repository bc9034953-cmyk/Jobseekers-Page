// Import configureStore from toolkit
import { configureStore } from '@reduxjs/toolkit';
import usersSlice from './screens/users-slice';
import { baseApi } from './screens/baseApi';
import candidatesSlice from './screens/Employer/CandidateListing/CandidateFiltersModal/candidates-slice';
import jobFiltersSlice from './screens/JobListing/JobFiltersModal/job-filters-slice';

export default configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    users: usersSlice,
    candidates: candidatesSlice,
    jobFilters: jobFiltersSlice,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(baseApi.middleware);
  },
  devTools: true,
});
