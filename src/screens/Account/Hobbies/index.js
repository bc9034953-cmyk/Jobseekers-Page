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
import HobbiesForm from './HobbiesForm';
import FontAwesomeIcon6 from 'react-native-vector-icons/FontAwesome6';

export default function Hobbies() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;
  const additionalDetails = getParsedJson(customer?.additional_fields, null);
  const hobbies = additionalDetails?.hobbies || '';

  const getHobbiesList = hobbiesString => {
    if (!hobbiesString) return [];
    return hobbiesString
      .split('\n')
      .map(hobby => hobby.trim())
      .filter(hobby => hobby);
  };

  const hobbiesList = getHobbiesList(hobbies);

  const handleAddClick = () => {
    setIsModalVisible(true);
  };

  return (
    <View style={styles.boxContainer}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={[style.m16, { color: Colors.txt }]}>Hobbies</Text>

        <TouchableOpacity style={styles.editBtn} onPress={handleAddClick}>
          {hobbiesList.length > 0 ? (
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

      {hobbiesList.length === 0 ? (
        <Text style={[style.r12, { color: Colors.txt, paddingTop: 20 }]}>
          No hobbies added yet.
        </Text>
      ) : (
        <View style={styles.pillsContainer}>
          {hobbiesList.map((hobby, index) => (
            <Pressable onPress={handleAddClick} key={index} style={styles.pill}>
              <Text
                style={[style.r12, { color: Colors.primary, lineHeight: 18 }]}>
                {hobby}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <HobbiesForm
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
