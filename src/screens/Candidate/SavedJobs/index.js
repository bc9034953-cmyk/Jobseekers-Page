import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import style from '../../../theme/style';
import { Colors } from '../../../theme/color';
import { ActivityIndicator, AppBar, Spacer } from '@react-native-material/core';
import { jobsApiSlice } from '../../api-slices/jobs-api-slice';
import SingleJobItem from '../../../components/SingleJobItem';

export default function SavedJobs() {
  const { data, isLoading } = jobsApiSlice.useGetBookmarkedJobsQuery();

  const renderComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.body}>
          <ActivityIndicator color={Colors.primary} size={'large'} />
        </View>
      );
    }

    if (data?.length > 0) {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          {data?.map(item => (
            <SingleJobItem
              job={{ ...item, ...item?.job }}
              key={`saved-job-${item?.id}`}
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
          No saved jobs found
        </Text>

        <Text style={{ fontSize: 14, color: Colors.txt, opacity: 0.8 }}>
          Your saved jobs will show up here.
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
          title="Saved Jobs"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
            marginBottom: 15,
          }}
          titleStyle={[style.subtitle, { color: Colors.active }]}
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
