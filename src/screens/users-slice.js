import {createSlice} from '@reduxjs/toolkit';
import Configs from '../utils/Configs';
import {removeCache, setJsonCache} from '../utils';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    checkoutRedirectPath: {},
  },
  reducers: {
    setUserData: (state, {payload}) => {
      setJsonCache(Configs.USER_DATA_STORAGE_KEY, payload);
      state.data = payload;
    },
    setAuthToken: (state, {payload}) => {
      state.authToken = payload;
    },
    setCheckoutResponse: (state, {payload}) => {
      state.checkoutResponse = payload;
    },
    clearUserData: state => {
      removeCache(Configs.USER_DATA_STORAGE_KEY);
      state.data = null;
      state.profilePictureUrl = null;
      state.authToken = null;
    },
    setCheckoutRedirectPath: (state, {payload}) => {
      state.checkoutRedirectPath = payload;
    },
  },
});

export const {
  setUserData,
  clearUserData,
  setAuthToken,
  setCheckoutResponse,
  setCheckoutRedirectPath,
} = usersSlice.actions;
export default usersSlice.reducer;
