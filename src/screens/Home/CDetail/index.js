import React, {useRef, useState} from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../../theme/color';
import style from '../../../theme/style';
import ScreenLayout from '../../ScreenLayout';
import {companiesApiSlice} from '../../api-slices/companies-api-slice';
import AppLoader from '../../../components/AppLoader';
import {getCompanyLogo, scrollTo} from '../../../utils';
import useGetJobLocation from '../../../components/useGetJobLocation';
import Tabs from '../../../components/Tabs';
import OpeningJobs from './OpeningJobs';
import Details from './Details';

const tabData = [
  {label: 'Details', value: 'Details'},
  {label: 'Opening Jobs', value: 'Opening Jobs'},
];

export default function CDetail({route}) {
  const {getLocation} = useGetJobLocation();
  const [activeTab, setActiveTab] = useState('Details');

  const scrollRef = useRef();

  const params = route?.params;

  const {
    data: company,
    isLoading,
    isFetching,
    refetch,
  } = companiesApiSlice.useGetCompanyDetailsQuery(params?.id, {
    skip: !params?.id,
  });

  const showOpeningJobs = () => {
    scrollTo(scrollRef);
    setActiveTab('Opening Jobs');
  };

  const renderTabBody = () => {
    switch (activeTab) {
      case 'Opening Jobs':
        return <OpeningJobs company={company} />;

      case 'Details':
        return <Details company={company} />;
    }
  };

  if (isLoading) {
    return (
      <ScreenLayout title="Company Details">
        <AppLoader />
      </ScreenLayout>
    );
  }

  if (!company) {
    return (
      <ScreenLayout title="Company Details">
        <View style={styles.body}>
          <Image
            source={require('../../../../assets/image/job.png')}
            style={{width: 65, height: 65, marginBottom: 15}}
          />

          <Text style={[style.b18, {color: Colors.txt}]}>
            Company Details Unavailable
          </Text>

          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              color: Colors.txt,
              opacity: 0.8,
            }}>
            We couldn't retrieve the company details. Please try again later.
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Company Details">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        style={{marginTop: 10}}
        contentContainerStyle={{paddingBottom: 120}}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }>
        <Image
          source={getCompanyLogo(company?.logo, '')}
          resizeMode="contain"
          style={{height: 88, width: 88, marginTop: 10, borderRadius: 8}}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View style={{flex: 1}}>
            <Text style={[style.subtitle, {color: Colors.txt}]}>
              {company?.name}
            </Text>
            {company?.establishment_year && (
              <Text style={[style.r14, {color: Colors.txt}]}>
                Since {company?.establishment_year}
              </Text>
            )}
            <Text style={[style.r14, {color: Colors.txt}]}>
              {getLocation(company?.job_location_id)}
            </Text>
          </View>
        </View>

        <Tabs
          tabData={tabData}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />

        {renderTabBody()}
      </ScrollView>

      <View style={styles.floatBtnContainer}>
        <Pressable
          onPress={showOpeningJobs}
          style={[
            style.btn,
            {
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 22,
              paddingRight: 15,
            },
          ]}>
          <Text style={[style.btntxt, {flex: 1}]}>
            {company?.total_job_count} Available Jobs
          </Text>
          <Icon name="chevron-forward" size={24} color={Colors.secondary} />
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -80,
  },
  floatBtnContainer: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    alignItems: 'center',
  },
});
