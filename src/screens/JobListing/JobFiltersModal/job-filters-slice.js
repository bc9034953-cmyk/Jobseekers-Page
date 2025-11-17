import {createSlice} from '@reduxjs/toolkit';

const jobFiltersSlice = createSlice({
  name: 'jobs-filters-slice',
  initialState: {
    selectedFilters: [],
    tempSelectedFilters: [],
    filterParams: {},
  },
  reducers: {
    setSelectedFilters: (state, {payload}) => {
      state.selectedFilters = payload;
    },
    setTempSelectedFilters: (state, {payload}) => {
      state.tempSelectedFilters = payload;
    },
    setFilterParams: (state, {payload}) => {
      state.filterParams = payload;
    },
  },
});

export const {setSelectedFilters, setFilterParams, setTempSelectedFilters} =
  jobFiltersSlice.actions;
export default jobFiltersSlice.reducer;
