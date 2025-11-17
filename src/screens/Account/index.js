import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import React, { useState } from 'react';
import ScreenLayout from '../ScreenLayout';
import UpdateProfilePic from './UpdateProfilePic';
import style from '../../theme/style';
import { Colors } from '../../theme/color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { baseApi } from '../baseApi';
import { clearUserData } from '../users-slice';
import { isUserEmployer, showSuccess } from '../../utils';
import ProfileMeter from './ProfileMeter';
import CreditMeter from './CreditMeter';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Divider } from '@react-native-material/core';

const MenuItem = ({
  name,
  icon,
  onPress,
  isLastItem,
  isEmployerMenu,
  isCandidateMenu,
  userData,
}) => {
  if (isEmployerMenu && !isUserEmployer(userData)) {
    return null;
  }

  if (isCandidateMenu && isUserEmployer(userData)) {
    return null;
  }

  return (
    <>
      <TouchableOpacity style={[styles.itemRow]} onPress={onPress}>
        <View style={styles.leftView}>
          {icon}
          <Text style={[style.m14, { color: Colors.txt }]}>{name}</Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          color={Colors.primary}
          size={20}
        />
      </TouchableOpacity>

      {!isLastItem && (
        <Divider color={Colors.bord} style={{ marginHorizontal: 15 }} />
      )}
    </>
  );
};

export default function Account() {
  const navigation = useNavigation();
  const userData = useSelector(state => state.users.data);
  const authToken = userData?.token;
  const dispatch = useDispatch();

  const [isConfModalOpened, setIsConfModalOpened] = useState(false);

  const handleNavigate = (path, isProtected, params) => {
    if (isProtected && !authToken) {
      navigation.navigate('Login');
      return;
    }

    navigation.navigate(path, params);
  };

  const onLogout = () => {
    if (authToken) {
      setIsConfModalOpened(true);
    } else {
      navigation.navigate('Login');
    }
  };

  const onRateUs = () => {
    const playStoreUrl =
      'https://play.google.com/store/apps/details?id=com.zarrtechnologies.jobseekerspage';

    Linking.openURL(playStoreUrl).catch(err => {
      console.error('Error opening store:', err);
    });
  };

  return (
    <ScreenLayout title={'Account'} showBackIcon={false} centerTitle={true}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        <UpdateProfilePic v="v2" />

        <ProfileMeter
          showButton={true}
          key={`profile-${userData?.customer?.id}`}
        />
        <CreditMeter
          showButton={true}
          key={`credit-${userData?.customer?.id}`}
        />

        <Text
          style={[
            style.s16,
            { color: Colors.txt, marginTop: 18, marginBottom: -15 },
          ]}>
          Accounts
        </Text>

        <View style={styles.container}>
          <MenuItem
            name="Profile"
            icon={<FeatherIcon name="user" size={18} color={Colors.txt} />}
            onPress={() =>
              handleNavigate(
                isUserEmployer(userData) ? 'EmpProfileForm' : 'Profile',
                true,
              )
            }
          />

          <MenuItem
            name="Search Candidates"
            icon={<FeatherIcon name="search" size={18} color={Colors.txt} />}
            onPress={() => handleNavigate('CandidateListing', false)}
            isEmployerMenu={true}
            userData={userData}
          />

          <MenuItem
            name="Recently Viewed Jobs"
            icon={
              <MaterialCommunityIcons
                name="briefcase-outline"
                size={18}
                color={Colors.txt}
              />
            }
            onPress={() => handleNavigate('RecentlyViewedJobsPage', false)}
            isCandidateMenu={true}
            userData={userData}
          />

          <MenuItem
            name="Manage Jobs"
            onPress={() => handleNavigate('ManageJobs', true)}
            icon={
              <MaterialCommunityIcons
                name="briefcase-outline"
                size={18}
                color={Colors.txt}
              />
            }
            isEmployerMenu={true}
            userData={userData}
          />

          <MenuItem
            name="Manage Companies"
            onPress={() => handleNavigate('ManageCompanies', true)}
            icon={
              <MaterialCommunityIcons
                name="office-building-outline"
                size={18}
                color={Colors.txt}
              />
            }
            isEmployerMenu={true}
            userData={userData}
          />

          <MenuItem
            name="Recently Viewed Candidates"
            icon={
              <MaterialCommunityIcons
                name="account-group-outline"
                size={18}
                color={Colors.txt}
              />
            }
            onPress={() =>
              handleNavigate('RecentlyViewedCandidatesPage', false)
            }
            isEmployerMenu={true}
            userData={userData}
          />

          <MenuItem
            name="Credits & history"
            onPress={() => handleNavigate('CreditHistory', true)}
            icon={
              <MaterialCommunityIcons
                name="history"
                size={18}
                color={Colors.txt}
              />
            }
            isEmployerMenu={true}
            userData={userData}
          />

          <MenuItem
            name="Purchased Candidates"
            onPress={() => handleNavigate('PurchasedCandidates', true)}
            icon={
              <MaterialCommunityIcons
                name="history"
                size={18}
                color={Colors.txt}
              />
            }
            isEmployerMenu={true}
            userData={userData}
          />

          <MenuItem
            name="Change Password"
            onPress={() => handleNavigate('ChangePass', true)}
            isLastItem={true}
            icon={
              <MaterialCommunityIcons
                name="lock-outline"
                size={18}
                color={Colors.txt}
              />
            }
          />
        </View>

        <Text
          style={[
            style.s16,
            { color: Colors.txt, marginTop: 18, marginBottom: -15 },
          ]}>
          More
        </Text>
        <View style={styles.container}>
          <MenuItem
            name="Pricing"
            onPress={() => handleNavigate('Pricing', true)}
            icon={<Entypo name="paper-plane" size={18} color={Colors.txt} />}
            isEmployerMenu={true}
            userData={userData}
          />

          <MenuItem
            name="About Us"
            icon={<Entypo name="text-document" size={18} color={Colors.txt} />}
            onPress={() =>
              handleNavigate('CmsPage', false, {
                title: 'About Us',
                url_slug: 'about-us',
              })
            }
          />

          <MenuItem
            name="Terms & Condition"
            onPress={() =>
              handleNavigate('CmsPage', false, {
                title: 'Terms & Condition',
                url_slug: 'terms-and-conditions',
              })
            }
            icon={<Entypo name="text-document" size={18} color={Colors.txt} />}
          />

          <MenuItem
            name="Privacy Policy"
            onPress={() =>
              handleNavigate('CmsPage', false, {
                title: 'Privacy Policy',
                url_slug: 'privacy-policy',
              })
            }
            icon={<Entypo name="text-document" size={18} color={Colors.txt} />}
          />

          <MenuItem
            name="Contact Us"
            onPress={() => handleNavigate('ContactUs')}
            icon={
              <FeatherIcon name="phone-call" size={18} color={Colors.txt} />
            }
          />

          <MenuItem
            name="Rate Us"
            onPress={onRateUs}
            icon={
              <MaterialCommunityIcons
                name="star-outline"
                size={18}
                color={Colors.txt}
              />
            }
          />

          <MenuItem
            name="Switch User"
            onPress={() => handleNavigate('On1')}
            isLastItem={true}
            icon={
              <Image
                source={require('../../../assets/image/swap.png')}
                style={{ width: 18, height: 18 }}
              />
            }
          />
        </View>

        <View style={styles.container}>
          <MenuItem
            name={authToken ? 'Logout' : 'Login'}
            isLastItem={true}
            onPress={onLogout}
            icon={
              <MaterialCommunityIcons
                name="logout"
                size={18}
                color={Colors.txt}
              />
            }
          />
        </View>

        <Text
          style={[
            style.r11,
            {
              color: Colors.txt2,
              textAlign: 'center',
              marginTop: 30,
              opacity: 0.8,
            },
          ]}>
          Version: 1.0.3
        </Text>
      </ScrollView>

      {isConfModalOpened && (
        <ConfirmationModal
          isModalOpened={isConfModalOpened}
          setIsModalOpened={setIsConfModalOpened}
          title="Logout"
          description="Are you sure you want to logout?"
          modalHeight={180}
          confirmHandler={() => {
            setIsConfModalOpened(false);
            dispatch(baseApi.util.resetApiState());
            dispatch(clearUserData());
            showSuccess('Logged out successfully!');
            setTimeout(() => {
              navigation.navigate('Login');
            }, 100);
          }}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.bord,
    borderRadius: 10,
    marginTop: 20,
  },
  leftView: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  itemRow: {
    paddingVertical: 18,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemRow2: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.bord,
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 15,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
