import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ScreenLayout from '../../ScreenLayout';
import {companiesApiSlice} from '../../api-slices/companies-api-slice';
import {useSelector} from 'react-redux';
import SingleCompanyItem from '../../../components/SingleCompanyItem';
import AppLoader from '../../../components/AppLoader';
import {Colors} from '../../../theme/color';
import style from '../../../theme/style';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import EmptyCompanySec from './EmptyCompanySec';

export default function ManageCompanies() {
  const userData = useSelector(state => state.users.data);
  const navigation = useNavigation();

  let {data: companies, isLoading} = companiesApiSlice.useGetCompaniesQuery({
    'JobCompaniesSearch[employer_id]': userData?.customer?.id,
  });

  if (companies?.length === 0 || !companies) {
    return (
      <ScreenLayout title="Manage Companies">
        <EmptyCompanySec />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Manage Companies">
      {isLoading ? (
        <AppLoader />
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 100}}>
            {companies?.map(company => (
              <SingleCompanyItem details={company} key={company?.id} />
            ))}
          </ScrollView>

          {companies?.length < 1 && (
            <View style={styles.floatBtnContainer}>
              <Pressable
                onPress={() => navigation.navigate('CompanyForm')}
                style={styles.floatBtn}>
                <Entypo name="plus" size={20} color={Colors.white} />
                <Text style={[style.r14, {color: Colors.white, marginTop: 3}]}>
                  Add a new company
                </Text>
              </Pressable>
            </View>
          )}
        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  floatBtnContainer: {
    position: 'absolute',
    bottom: 25,
    width: '100%',
    alignItems: 'center',
  },
  floatBtn: {
    backgroundColor: Colors.primary,
    padding: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
});
