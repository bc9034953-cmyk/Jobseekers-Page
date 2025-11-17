import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import ScreenLayout from '../ScreenLayout';
import {baseApi} from '../baseApi';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {Colors} from '../../theme/color';
import {ActivityIndicator} from '@react-native-material/core';
import style from '../../theme/style';

export default function CmsPage({route}) {
  const params = route?.params;
  const title = params?.title;
  const url_slug = params?.url_slug;

  const {data, isLoading, refetch, isFetching} =
    baseApi.useGetPageDetailsQuery(url_slug);
  const {width} = useWindowDimensions();

  const pageContent = data?.length ? data[0]?.content : null;

  const renderBody = () => {
    if (isLoading || isFetching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.primary} size={'large'} />
        </View>
      );
    }

    if (!pageContent) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={[style.m15]}>Sorry, Unable to fetch details!</Text>
          <TouchableOpacity style={styles.button} onPress={refetch}>
            <Text style={[style.m14, {color: Colors.white}]}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={{paddingBottom: 40, marginTop: 10}}>
        <RenderHtml
          baseStyle={{
            color: Colors.txt,
            fontSize: 14,
          }}
          contentWidth={width}
          source={{html: pageContent}}
        />
      </ScrollView>
    );
  };

  return <ScreenLayout title={title}>{renderBody()}</ScreenLayout>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 70,
  },
  button: {
    borderColor: Colors.primary,
    borderWidth: 1,
    backgroundColor: Colors.primary,
    width: 130,
    paddingVertical: 5,
    borderRadius: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});
