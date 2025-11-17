import {Spacer} from '@react-native-material/core';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppLoader from '../../components/AppLoader';
import {Colors} from '../../theme/color';
import style from '../../theme/style';
import {getUnreadNotifications, showError} from '../../utils';
import ScreenLayout from '../ScreenLayout';
import {notificationsApiSlice} from '../api-slices/notifications-api-slice';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function Notification() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  const {data, error, isLoading} =
    notificationsApiSlice.useGetNotificationsQuery();
  const [markNotificationsViewed] =
    notificationsApiSlice.useMarkNotificationsViewedMutation();

  let notfications = data;

  useEffect(() => {
    if (isFocused) {
      setLoading(false);
    }
  }, [isFocused]);

  if (activeTab === 'Unread') {
    notfications = getUnreadNotifications(data);
  }

  useEffect(() => {
    if (error) {
      showError(error, 4000, navigation);
    }
  }, [error, navigation]);

  const markViewed = async id => {
    try {
      await markNotificationsViewed({
        id,
        is_viewed: 1,
      }).unwrap();
    } catch (err) {
      showError(err);
    }
  };

  const isViewed = item => item?.is_viewed === 0;

  if (loading || isLoading) {
    return (
      <ScreenLayout title="Notifications">
        <AppLoader />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Notifications">
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('All')}
          style={[styles.tab, activeTab === 'All' ? styles.activeTab : '']}>
          <Text style={{color: activeTab === 'All' ? '#fff' : Colors.txt}}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('Unread')}
          style={[styles.tab, activeTab === 'Unread' ? styles.activeTab : '']}>
          <Text style={{color: activeTab === 'Unread' ? '#fff' : Colors.txt}}>
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 5}}>
        {notfications?.map(item => (
          <View
            key={'notification-' + item?.id}
            style={{
              backgroundColor: isViewed(item) ? Colors.primary : '#FBF6FF',
              borderRadius: 12,
              padding: 15,
              marginTop: 15,
            }}>
            {isViewed(item) && <View style={styles.dot} />}

            <Text
              style={[
                style.r14,
                {
                  color: isViewed(item) ? Colors.secondary : '#484848',
                  marginTop: 8,
                },
              ]}>
              {item.message || 'Unknown'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Icons
                name="clock-outline"
                size={16}
                color={isViewed(item) ? '#FFFFFF55' : '#787878'}
              />
              <Text
                style={[
                  style.r14,
                  {
                    color: isViewed(item) ? '#FFFFFF55' : '#787878',
                    flex: 1,
                    marginBottom: -5,
                    marginLeft: 5,
                  },
                ]}>
                {moment(item?.created_at).fromNow()}
              </Text>

              {isViewed(item) && (
                <TouchableOpacity onPress={() => markViewed(item?.id)}>
                  <Text
                    style={[style.m14, {color: '#FFFFFF', marginBottom: -5}]}>
                    Mark as read
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {(!notfications || notfications?.length === 0) && (
          <View
            style={{
              marginTop: height / 3.8,
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../assets/image/notification.png')}
              style={{width: 60, height: 60}}
            />
            <Text style={[style.s14, {textAlign: 'center', marginTop: 15}]}>
              {activeTab === 'Unread'
                ? 'No unread notifications at the moment. Stay tuned for future updates!'
                : 'No notifications at the moment, Stay tuned for future notifications!'}
            </Text>
          </View>
        )}

        <Spacer h={60} />
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  tab: {
    width: width / 2 - 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  dot: {
    height: 12,
    width: 12,
    backgroundColor: Colors.secondary,
    borderRadius: 6,
  },
});
