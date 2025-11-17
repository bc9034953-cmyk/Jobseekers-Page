import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../../theme/color';
import style from '../../../theme/style';
import { getParsedJson, showSuccess } from '../../../utils';
import { usersApiSlice } from '../../users-api-slice';
import { setUserData } from '../../users-slice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function KeySkillsForm({ isVisible, setIsVisible }) {
  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;
  const dispatch = useDispatch();

  const [inputSkill, setInputSkill] = useState('');
  const [skillsList, setSkillsList] = useState([]);
  const [validationError, setValidationError] = useState('');

  const additionalDetails = getParsedJson(customer?.additional_fields, null);

  const existingSkills = useMemo(() => {
    return additionalDetails?.skills || '';
  }, [additionalDetails]);

  const [updateProfile, { isLoading }] =
    usersApiSlice.useUpdateProfileMutation();

  useEffect(() => {
    if (isVisible) {
      // Load existing skills when modal opens
      const skillsArray = existingSkills
        ? existingSkills
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill)
        : [];
      setSkillsList(skillsArray);
      setInputSkill('');
      setValidationError('');
    }
  }, [isVisible, existingSkills]);

  const handleAddSkill = () => {
    const skill = inputSkill.trim();
    if (!skill) {
      setValidationError('Please enter a skill');
      return;
    }
    if (skillsList.includes(skill)) {
      setValidationError('This skill is already added');
      return;
    }
    setSkillsList([...skillsList, skill]);
    setInputSkill('');
    setValidationError('');
  };

  const handleRemoveSkill = skillToRemove => {
    setSkillsList(skillsList.filter(skill => skill !== skillToRemove));
  };

  const handleInputChange = text => {
    setInputSkill(text);
    if (validationError) {
      setValidationError('');
    }
    // Check if user typed a comma
    if (text.includes(',')) {
      const skill = text.replace(',', '').trim();
      if (skill && !skillsList.includes(skill)) {
        setSkillsList([...skillsList, skill]);
        setInputSkill('');
        setValidationError('');
      } else if (skill && skillsList.includes(skill)) {
        setValidationError('This skill is already added');
        setInputSkill('');
      }
    }
  };

  const handleSave = async () => {
    if (skillsList.length === 0) {
      setValidationError('Please add at least one skill');
      return;
    }

    try {
      const payload = {
        id: customer?.id,
        name: customer?.name,
        AdditionalFields: {
          ...additionalDetails,
          skills: skillsList.join(', '),
        },
      };

      const response = await updateProfile(payload).unwrap();

      if (response) {
        dispatch(
          setUserData({
            token: userData?.token,
            customer: response,
          }),
        );
        showSuccess('Skills updated successfully.');
        setIsVisible(false);
        setSkillsList([]);
        setInputSkill('');
        setValidationError('');
      }
    } catch (error) {
      setValidationError(error?.data?.message || 'Failed to update skills');
    }
  };

  const handleCancel = () => {
    setIsVisible(false);
    setSkillsList([]);
    setInputSkill('');
    setValidationError('');
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleCancel}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[style.s18, { color: Colors.txt }]}>Key Skills</Text>

          <Text style={[style.r12, { color: Colors.txt }]}>
            Add your key skills and expertise to showcase your capabilities to
            potential employers.
          </Text>
        </View>

        <View style={styles.content}>
          {/* Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputSkill}
                onChangeText={handleInputChange}
                placeholder="Enter a skill"
                onSubmitEditing={handleAddSkill}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[
                  styles.addButton,
                  { display: inputSkill.trim() ? 'flex' : 'none' },
                ]}
                onPress={handleAddSkill}
                disabled={!inputSkill.trim()}>
                <Icon name="plus" size={20} color={Colors.divider} />
              </TouchableOpacity>
            </View>
            {validationError ? (
              <Text style={styles.errorText}>{validationError}</Text>
            ) : null}
          </View>

          {/* Skills Pills Section */}
          {skillsList.length > 0 && (
            <View style={{ flex: 1, marginTop: 5 }}>
              <View style={styles.pillsContainer}>
                {skillsList.map((skill, index) => (
                  <View key={index} style={styles.pill}>
                    <Text style={[style.r12, { color: Colors.txt }]}>
                      {skill}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveSkill(skill)}>
                      <Icon name="close" size={16} color={Colors.txt} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {skillsList.length === 0 && (
            <View style={styles.emptyState}>
              <Text
                style={[style.r12, { color: Colors.txt, textAlign: 'center' }]}>
                No skills added yet. Start by adding your first skill above.
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={[style.m14, { color: Colors.primary }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, { opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleSave}
              disabled={isLoading}>
              <Text style={[style.m14, { color: Colors.white }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputSection: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 30,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.txt,
  },
  addButton: {
    padding: 5,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 12,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    backgroundColor: Colors.primary + '15',
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  removeButton: {
    padding: 2,
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  bottomBar: {
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: Colors.white,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 22,
    flexDirection: 'row',
  },
  cancelBtn: {
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 18,
  },
});
