import {createSlice} from '@reduxjs/toolkit';

const jobFiltersSlice = createSlice({
  name: 'jobFilters',
  initialState: {
    filters: [],
  },
  reducers: {
    setJobFilters: (state, {payload}) => {
      state.filters = payload;
    },
    clearJobFilters: state => {
      state.data = [];
    },
  },
});

export const {setJobFilters, clearJobFilters} = jobFiltersSlice.actions;
export default jobFiltersSlice.reducer;
