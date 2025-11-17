import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef } from 'react';
import style from '../../../theme/style';
import { Colors } from '../../../theme/color';
import ExperienceJourney from './ExperienceJourney';

export default function WorkExperience({ userId }) {
  const experienceJourneyRef = useRef();

  const handleAddClick = () => {
    if (experienceJourneyRef.current?.handleAddNew) {
      experienceJourneyRef.current.handleAddNew();
    }
  };

  return (
    <View style={styles.boxContainer}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={[style.m16, { color: Colors.txt }]}>Work Experience</Text>

        {!userId && (
          <TouchableOpacity style={styles.editBtn} onPress={handleAddClick}>
            <Text style={[style.m14, { color: Colors.primary }]}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <ExperienceJourney ref={experienceJourneyRef} userId={userId} />
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
