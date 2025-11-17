import { ActivityIndicator, Spacer } from '@react-native-material/core';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Colors } from '../../../theme/color';
import style from '../../../theme/style';
import { getFirstChar, renderMonth } from '../../../utils';
import { contentApiSlice } from '../../api-slices/content-api-slice';
import UpsertCertificationsModal from './UpsertCertificationsModal';

const CertificationsJourney = forwardRef(({ userId }, ref) => {
  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const params = {
    'ContentsSearch[type]': 'candidate_certifications',
    'ContentsSearch[customer_id]': userId ? userId : customer?.id,
    sort: 'id',
  };
  const { data: certifications, isLoading } =
    contentApiSlice.useGetContentsQuery(params);

  const getValidity = item => {
    const issueMonth = item?.additional_fields?.issue_month;
    const issueYear = item?.additional_fields?.issue_year;

    const expirationMonth = item?.additional_fields?.expiration_month;
    const expirationYear = item?.additional_fields?.expiration_year;

    // Check if issue date exists
    if (!issueMonth || !issueYear) {
      return 'Issue date not specified';
    }

    // If no expiration date, return "does not expire" format
    if (!expirationMonth || !expirationYear) {
      return `Validity from: ${renderMonth(
        issueMonth,
      )} ${issueYear}. Does not expire`;
    }

    // Return validity range
    return `Validity: (${renderMonth(issueMonth)} ${issueYear} - ${renderMonth(
      expirationMonth,
    )} ${expirationYear})`;
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

  if (certifications?.length === 0) {
    return (
      <>
        <Text style={[style.r12, { color: Colors.txt, paddingTop: 20 }]}>
          No certification details available.
        </Text>

        <UpsertCertificationsModal
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          key="no-certification"
        />
      </>
    );
  }

  return (
    <View>
      <Spacer h={20} />
      {certifications?.map(item => (
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
              {item?.additional_fields?.organization}
            </Text>
            <Text style={[style.m12]}>{getValidity(item)}</Text>

            {item?.additional_fields?.url && (
              <Text
                style={[style.r13, { marginTop: 5, color: Colors.primary }]}>
                <Text style={[style.s13, { color: Colors.txt2 }]}>URL:</Text>{' '}
                {item?.additional_fields?.url}
              </Text>
            )}
          </View>
        </Pressable>
      ))}

      <UpsertCertificationsModal
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        key="certification"
      />
    </View>
  );
});

export default CertificationsJourney;

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
