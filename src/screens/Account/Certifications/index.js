import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef } from 'react';
import style from '../../../theme/style';
import { Colors } from '../../../theme/color';
import CertificationsJourney from './CertificationsJourney';

export default function Certifications({ userId }) {
  const certificationsJourneyRef = useRef();

  const handleAddClick = () => {
    if (certificationsJourneyRef.current?.handleAddNew) {
      certificationsJourneyRef.current.handleAddNew();
    }
  };

  return (
    <View style={styles.boxContainer}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={[style.m16, { color: Colors.txt }]}>Certifications</Text>

        {!userId && (
          <TouchableOpacity style={styles.editBtn} onPress={handleAddClick}>
            <Text style={[style.m14, { color: Colors.primary }]}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <CertificationsJourney ref={certificationsJourneyRef} userId={userId} />
    </View>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.divider,
    marginTop: 20,
    position: 'relative',
  },
  editBtn: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
