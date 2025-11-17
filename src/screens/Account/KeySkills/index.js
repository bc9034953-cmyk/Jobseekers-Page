import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import style from '../../../theme/style';
import { Colors } from '../../../theme/color';
import { useSelector } from 'react-redux';
import { getParsedJson } from '../../../utils';
import KeySkillsForm from './KeySkillsForm';
import FontAwesomeIcon6 from 'react-native-vector-icons/FontAwesome6';

export default function KeySkills() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;
  const additionalDetails = getParsedJson(customer?.additional_fields, null);
  const skills = additionalDetails?.skills || '';

  const getSkillsList = skillsString => {
    if (!skillsString) return [];
    return skillsString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill);
  };

  const skillsList = getSkillsList(skills);

  const handleAddClick = () => {
    setIsModalVisible(true);
  };

  return (
    <View style={styles.boxContainer}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={[style.m16, { color: Colors.txt }]}>Key Skills</Text>

        <TouchableOpacity style={styles.editBtn} onPress={handleAddClick}>
          {skillsList.length > 0 ? (
            <FontAwesomeIcon6
              name="pen-to-square"
              size={17}
              color={Colors.txt}
            />
          ) : (
            <Text style={[style.m14, { color: Colors.primary }]}>Add</Text>
          )}
        </TouchableOpacity>
      </View>

      {skillsList.length === 0 ? (
        <Text style={[style.r12, { color: Colors.txt, paddingTop: 20 }]}>
          No key skills added yet.
        </Text>
      ) : (
        <View style={styles.pillsContainer}>
          {skillsList.map((skill, index) => (
            <Pressable onPress={handleAddClick} key={index} style={styles.pill}>
              <Text
                style={[style.r12, { color: Colors.primary, lineHeight: 18 }]}>
                {skill}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <KeySkillsForm
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
      />
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
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  pill: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    marginRight: 8,
    marginBottom: 8,
  },
});
