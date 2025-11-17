import {Divider} from '@react-native-material/core';
import React, {useState} from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ConfirmationModal from '../../../components/ConfirmationModal';
import {Colors} from '../../../theme/color';
import style from '../../../theme/style';
import Configs from '../../../utils/Configs';
import Uploader from './Uploader';

const ActionItem = ({title, icon, onPress, isLast, isHighlighted}) => {
  return (
    <>
      <TouchableOpacity style={styles.actionItem} onPress={onPress}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={isHighlighted ? Colors.maroon : Colors.txt}
        />
        <Text
          style={[
            style.r15,
            {color: isHighlighted ? Colors.maroon : Colors.tx},
          ]}>
          {title}
        </Text>
      </TouchableOpacity>

      {!isLast && <Divider />}
    </>
  );
};

// default function
export default function ActionModal({
  details,
  handleUpdateProfile,
  isProfileUpdating,
}) {
  const [isConfModalOpened, setIsConfModalOpened] = useState(false);
  const [showEditResume, setShowEditResume] = useState(false);

  const deleteResumeHandler = () => {
    const data = {name: '', size: ''};
    handleUpdateProfile(data, 'delete');
  };

  const handleDownload = () => {
    const resumeUrl = `${Configs.DATA_URL}/customers/${details?.resume}`;
    Linking.openURL(resumeUrl);
  };

  const renderModalBody = () => {
    if (showEditResume) {
      return (
        <>
          <Text style={[style.r13, {color: Colors.txt2, marginTop: -8}]}>
            Select a new resume file to upload and replace the existing one.
          </Text>

          <Uploader
            handleUpdateProfile={handleUpdateProfile}
            isProfileUpdating={isProfileUpdating}
          />
        </>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30}}>
        <ActionItem
          title="Download"
          icon={'download'}
          onPress={handleDownload}
        />
        <ActionItem
          title="Replace file"
          icon={'file-sync'}
          onPress={() => setShowEditResume(true)}
        />
        <ActionItem
          title="Delete"
          icon={'delete'}
          isLast={true}
          isHighlighted={true}
          onPress={() => {
            this.RBSheet.close();
            setIsConfModalOpened(true);
          }}
        />
      </ScrollView>
    );
  };

  return (
    <View>
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        keyboardAvoidingViewEnabled={true}
        height={240}
        onClose={() => setShowEditResume(false)}
        openDuration={200}
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            backgroundColor: Colors.bg,
          },
        }}>
        <View style={styles.container}>
          <Text style={[style.s20, {color: Colors.txt, marginBottom: 10}]}>
            {showEditResume ? 'Replace file' : 'Resume options'}
          </Text>

          {renderModalBody()}
        </View>
      </RBSheet>

      {isConfModalOpened && (
        <ConfirmationModal
          isModalOpened={isConfModalOpened}
          setIsModalOpened={setIsConfModalOpened}
          description="Are you sure you want to delete this resume file?"
          modalHeight={200}
          confirmHandler={deleteResumeHandler}
          isLoading={isProfileUpdating}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  actionItem: {
    flexDirection: 'row',
    paddingVertical: 17,
    alignItems: 'center',
    gap: 10,
  },
});
