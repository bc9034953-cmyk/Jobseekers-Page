import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import React, { useEffect } from 'react';
import style from '../../../theme/style';
import { Colors } from '../../../theme/color';
import { ActivityIndicator, AppBar, Spacer } from '@react-native-material/core';
import { jobsApplicationsApiSlice } from '../../api-slices/job-applications-api-slice';
import SingleJobItem from '../../../components/SingleJobItem';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

export default function Applications() {
  const useData = useSelector(state => state.users.data);
  const customer = useData?.customer;
  const isFocused = useIsFocused();
  const { data, isLoading, refetch, isUninitialized, isFetching } =
    jobsApplicationsApiSlice.useGetJobApplicationsQuery(
      { 'JobApplicationsSearch[candidate_id]': customer?.id },
      {
        skip: !customer?.id,
      },
    );

  useEffect(() => {
    if (isFocused && !isUninitialized) {
      refetch();
    }
  }, [refetch, isFocused, isUninitialized]);

  const renderComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.body}>
          <ActivityIndicator color={Colors.primary} size={'large'} />
        </View>
      );
    }

    if (data?.length > 0 && customer?.id) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }>
          {data?.map(item => (
            <SingleJobItem
              job={{ ...item, ...item?.job }}
              key={`job-applications-${item?.id}`}
              jobTimeText="Applied"
            />
          ))}

          <Spacer h={30} />
        </ScrollView>
      );
    }

    return (
      <View style={styles.body}>
        <Image
          source={require('../../../../assets/image/job.png')}
          style={{ width: 65, height: 65, marginBottom: 15 }}
        />

        <Text style={[style.b18, { color: Colors.txt }]}>
          No job applications found
        </Text>

        <Text
          style={{
            fontSize: 14,
            textAlign: 'center',
            color: Colors.txt,
            opacity: 0.8,
          }}>
          Your applied jobs will show up here once you start applying.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.bg }]}>
      <StatusBar
        translucent={false}
        backgroundColor={Colors.bg}
        barStyle={'dark-content'}
      />

      <View
        style={[
          style.main,
          {
            backgroundColor: Colors.bg,
          },
        ]}>
        <AppBar
          color={Colors.bg}
          elevation={0}
          centerTitle={true}
          title="Applications"
          titleStyle={[style.subtitle, { color: Colors.active }]}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
            marginBottom: 15,
          }}
        />

        {renderComponent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
