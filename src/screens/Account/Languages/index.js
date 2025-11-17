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
import LanguagesForm from './LanguagesForm';
import FontAwesomeIcon6 from 'react-native-vector-icons/FontAwesome6';

export default function Languages() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;
  const additionalDetails = getParsedJson(customer?.additional_fields, null);
  const languages = additionalDetails?.languages_known || '';

  const getLanguagesList = languagesString => {
    if (!languagesString) return [];
    return languagesString
      .split(',')
      .map(language => language.trim())
      .filter(language => language);
  };

  const languagesList = getLanguagesList(languages);

  const handleAddClick = () => {
    setIsModalVisible(true);
  };

  return (
    <View style={styles.boxContainer}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={[style.m16, { color: Colors.txt }]}>Languages</Text>

        <TouchableOpacity style={styles.editBtn} onPress={handleAddClick}>
          {languagesList.length > 0 ? (
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

      {languagesList.length === 0 ? (
        <Text style={[style.r12, { color: Colors.txt, paddingTop: 20 }]}>
          No languages added yet.
        </Text>
      ) : (
        <View style={styles.pillsContainer}>
          {languagesList.map((language, index) => (
            <Pressable onPress={handleAddClick} key={index} style={styles.pill}>
              <Text
                style={[style.r12, { color: Colors.primary, lineHeight: 18 }]}>
                {language}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <LanguagesForm
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
