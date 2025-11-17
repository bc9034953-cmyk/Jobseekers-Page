import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login/Login';
import Splash from '../screens/Splash';
import Introduction from '../screens/Introduction/Introduction';
import On1 from '../screens/Introduction/On1';
import On2 from '../screens/Introduction/On2';
import On3 from '../screens/Introduction/On3';
import Signup from '../screens/Login/Signup';
import VId from '../screens/Login/VId';
import Otp from '../screens/Login/Otp';
import Phone from '../screens/Login/Phone';
import Email from '../screens/Login/Email';
import Forgot from '../screens/Login/Forgot';
import NewPass from '../screens/Login/NewPass';
import ChangePass from '../screens/Account/ChangePass';
import Success from '../screens/Login/Success';
import Account from '../screens/Account';
import Profile from '../screens/Account/Profile';
import Notification from '../screens/Home/Notification';
import Chat from '../screens/Message/Chat';
import Message from '../screens/Message/Message';
import Home from '../screens/Home/Home';
import Search from '../screens/Search/Search';
import SActive from '../screens/Search/SActive';
import JobDetail from '../screens/Home/JobDetail';
import CDetail from '../screens/Home/CDetail';
import RecentlyViewedJobsPage from '../screens/RecentlyViewed/RecentlyViewedJobsPage';
import RecentlyViewedCandidatesPage from '../screens/RecentlyViewed/RecentlyViewedCandidatesPage';

import MyTabs from './BottomNavigator';
import { useDispatch } from 'react-redux';
import Configs from '../utils/Configs';
import { setAuthToken, setUserData } from '../screens/users-slice';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import JobListing from '../screens/JobListing';
import ProfileForm from '../screens/Account/ProfileForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getParsedJson } from '../utils';
import CmsPage from '../screens/CmsPage';
import ContactUs from '../screens/ContactUs';
import EmployerProfileForm from '../screens/Account/EmployerProfileForm';
import ManageCompanies from '../screens/Employer/ManageCompanies';
import CompanyForm from '../screens/Employer/ManageCompanies/CompanyForm';
import ManageJobs from '../screens/Employer/ManageJobs';
import JobForm from '../screens/Employer/ManageJobs/JobForm';
import CandidateListing from '../screens/Employer/CandidateListing';
import CandidateDetails from '../screens/Employer/CandidateDetails';
import CreditHistory from '../screens/Employer/CreditHistory';
import Pricing from '../screens/Pricing';
import Checkout from '../screens/Checkout';
import CandidateApplications from '../screens/Employer/CandidateApplications';
import VerifyEmail from '../screens/Login/VerifyEmail';
import VerifyMobile from '../screens/Login/VerifyMobile';
import VerifyEmailAndMobile from '../screens/Login/VerifyEmailAndMobile';
import PurchasedCandidates from '../screens/Employer/PurchasedCandidates';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const [showSplashScreen, setshowSplashScreen] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserData = async () => {
      const response = await AsyncStorage.getItem(
        Configs.USER_DATA_STORAGE_KEY,
      );

      if (response) {
        const getParsedResponse = getParsedJson(response);

        dispatch(setUserData(getParsedResponse));
        dispatch(setAuthToken(getParsedResponse?.token));
      }
    };

    getUserData();
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setshowSplashScreen(false);
    }, 3000);
  }, []);

  return (
    <AutocompleteDropdownContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {showSplashScreen ? (
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{ headerShown: false }}
            />
            
          ) : null}

          <Stack.Screen
            name="Introduction"
            component={Introduction}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="On1"
            component={On1}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="VerifyEmail"
            component={VerifyEmail}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="VerifyMobile"
            component={VerifyMobile}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="VerifyEmailAndMobile"
            component={VerifyEmailAndMobile}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="MyTabs"
            component={MyTabs}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="JobListing"
            component={JobListing}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CDetail"
            component={CDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="JobDetail"
            component={JobDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SActive"
            component={SActive}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Search"
            component={Search}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Message"
            component={Message}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ManageCompanies"
            component={ManageCompanies}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CompanyForm"
            component={CompanyForm}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ManageJobs"
            component={ManageJobs}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CandidateApplications"
            component={CandidateApplications}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="JobForm"
            component={JobForm}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Notification"
            component={Notification}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Pricing"
            component={Pricing}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Checkout"
            component={Checkout}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Account"
            component={Account}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CmsPage"
            component={CmsPage}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ContactUs"
            component={ContactUs}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ProfileForm"
            component={ProfileForm}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="EmpProfileForm"
            component={EmployerProfileForm}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Success"
            component={Success}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CandidateListing"
            component={CandidateListing}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CandidateDetails"
            component={CandidateDetails}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CreditHistory"
            component={CreditHistory}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="PurchasedCandidates"
            component={PurchasedCandidates}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="RecentlyViewedJobsPage"
            component={RecentlyViewedJobsPage}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="RecentlyViewedCandidatesPage"
            component={RecentlyViewedCandidatesPage}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="NewPass"
            component={NewPass}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ChangePass"
            component={ChangePass}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Forgot"
            component={Forgot}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Email"
            component={Email}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="VId"
            component={VId}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Otp"
            component={Otp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Phone"
            component={Phone}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="On3"
            component={On3}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="On2"
            component={On2}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AutocompleteDropdownContextProvider>
  );
}
