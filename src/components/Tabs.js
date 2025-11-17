import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Fragment} from 'react';
import style from '../theme/style';
import {Colors} from '../theme/color';

const width = Dimensions.get('window').width;

export default function Tabs({setActiveTab, activeTab, tabData, v}) {
  const isTabActive = tab => tab?.value === activeTab;

  const renderTab = tab => {
    if (v === 'v2') {
      return (
        <Pressable
          onPress={() => setActiveTab(tab?.value)}
          style={[
            styles.tabPill,
            styles[isTabActive(tab) ? 'tabPillActive' : ''],
          ]}>
          <Text
            style={[
              style.m14,
              styles.tabPillTxt,
              styles[isTabActive(tab) ? 'tabPillTxtActive' : ''],
            ]}>
            {tab?.label}
          </Text>
        </Pressable>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => setActiveTab(tab?.value)}
        style={[styles.tab, styles[isTabActive(tab) ? 'tabActive' : '']]}>
        <Text
          style={[
            style.m14,
            styles.tabTxt,
            styles[isTabActive(tab) ? 'tabTxtActive' : ''],
          ]}>
          {tab?.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
        marginBottom: 10,
        backgroundColor: '#fff',
      }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: v === 'v2' ? 8 : 0}}>
        {tabData?.map((tab, index) => (
          <Fragment key={`${tab?.value}-${index}`}>{renderTab(tab)}</Fragment>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    width: width / 2 - 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderBottomWidth: 2,
    borderBottomColor: Colors.divider,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabTxt: {
    color: Colors.disable,
  },
  tabTxtActive: {
    color: Colors.txt,
  },
  tabPill: {
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 30,
    paddingHorizontal: 17,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPillActive: {
    backgroundColor: Colors.primary,
  },
  tabPillTxt: {
    color: Colors.txt,
  },
  tabPillTxtActive: {
    color: Colors.white,
  },
});
