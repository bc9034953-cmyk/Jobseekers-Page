import {createSlice} from '@reduxjs/toolkit';

const candidatesSlice = createSlice({
  name: 'candidates-slice',
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
  candidatesSlice.actions;
export default candidatesSlice.reducer;
