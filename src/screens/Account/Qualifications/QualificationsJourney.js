import { ActivityIndicator, Spacer } from '@react-native-material/core';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Colors } from '../../../theme/color';
import style from '../../../theme/style';
import { getFirstChar, renderMonth } from '../../../utils';
import { contentApiSlice } from '../../api-slices/content-api-slice';
import UpsertQualificationsModal from './UpsertQualificationsModal';

const QualificationsJourney = forwardRef(({ userId }, ref) => {
  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const params = {
    'ContentsSearch[type]': 'candidate_qualifications',
    'ContentsSearch[customer_id]': userId ? userId : customer?.id,
    sort: 'id',
  };
  const { data: workExperience, isLoading } =
    contentApiSlice.useGetContentsQuery(params);

  const startData = item => {
    const date =
      renderMonth(item?.additional_fields?.start_month) +
      ' ' +
      item?.additional_fields?.start_year;
    return date;
  };

  const endData = item => {
    const date =
      renderMonth(item?.additional_fields?.end_month) +
      ' ' +
      item?.additional_fields?.end_year;

    return item?.additional_fields?.is_currently_working === 'Yes'
      ? 'Present'
      : date;
  };

  const handleOpenModal = item => {
    if (!userId) {
      setSelectedItem(item);
      setIsModalVisible(true);
    }
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsModalVisible(true);
  };

  useImperativeHandle(ref, () => ({
    handleAddNew,
  }));

  if (isLoading) {
    return (
      <View style={{ padding: 25, paddingBottom: 15 }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (workExperience?.length === 0) {
    return (
      <>
        <Text style={[style.r12, { color: Colors.txt, paddingTop: 20 }]}>
          No qualification details available.
        </Text>

        <UpsertQualificationsModal
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          key="no-qualification"
        />
      </>
    );
  }

  return (
    <View>
      <Spacer h={20} />
      {workExperience?.map(item => (
        <Pressable
          key={item?.id}
          style={styles.card}
          onPress={() => handleOpenModal(item)}>
          <View style={styles.divider} />

          <View style={styles.avatar}>
            <Text style={[style.m14, { color: '#fff', lineHeight: 20 }]}>
              {getFirstChar(item?.additional_fields?.title)}
            </Text>
          </View>

          <View style={{ paddingRight: 38 }}>
            <Text style={[style.m15, { color: Colors.txt }]}>
              {item?.additional_fields?.title}
            </Text>

            <Text style={[style.m13]}>
              {item?.additional_fields?.university_college}
            </Text>
            <Text style={[style.m12]}>
              ({startData(item) + ' - ' + endData(item)})
            </Text>

            {item?.additional_fields?.details && (
              <Text style={[style.r13, { marginTop: 5 }]}>
                {item?.additional_fields?.details}
              </Text>
            )}
          </View>
        </Pressable>
      ))}

      <UpsertQualificationsModal
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        key="qualification"
      />
    </View>
  );
});

export default QualificationsJourney;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
    position: 'relative',
  },
  divider: {
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    top: 38,
    left: 15,
    bottom: 10,
    position: 'absolute',
  },
  avatar: {
    width: 30,
    height: 30,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
