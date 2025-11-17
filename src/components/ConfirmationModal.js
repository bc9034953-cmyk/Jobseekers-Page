import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {memo, useEffect, useRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Colors} from '../theme/color';
import style from '../theme/style';
import Button from './Button';

function ConfirmationModal({
  isModalOpened,
  setIsModalOpened,
  title = 'Delete',
  description = 'Are you sure want to delete this ?',
  modalHeight = 220,
  confirmBtnText = 'Yes',
  cancelBtnText = 'Cancel',
  confirmHandler = () => {},
  isLoading,
}) {
  const refRBSheet = useRef();

  const onModalClose = () => {
    refRBSheet?.current?.close();
    setIsModalOpened(false);
  };

  useEffect(() => {
    if (isModalOpened) {
      refRBSheet?.current?.open();
    } else {
      refRBSheet?.current?.close();
      setIsModalOpened(false);
    }
  }, [isModalOpened, setIsModalOpened]);

  return (
    <View>
      <StatusBar
        backgroundColor={'rgba(255, 255, 255, 0.42)'}
        translucent={false}
        barStyle={'dark-content'}
      />

      <RBSheet
        ref={refRBSheet}
        onClose={onModalClose}
        keyboardAvoidingViewEnabled={true}
        height={modalHeight}
        openDuration={200}
        customStyles={{container: styles.modalContainer}}>
        <View style={styles.container}>
          <View>
            <Text style={[style.s20, styles.title]}>{title}</Text>

            <Text style={[style.r14, styles.desc]}>{description}</Text>
          </View>

          <View style={styles.btnContainer}>
            <Button
              v="v2"
              styles={styles.btn}
              variant="outlined"
              onPress={onModalClose}>
              {cancelBtnText}
            </Button>
            <Button
              v="v2"
              styles={styles.btn}
              onPress={confirmHandler}
              isLoading={isLoading}>
              {confirmBtnText}
            </Button>
          </View>
        </View>
      </RBSheet>
    </View>
  );
}

export default memo(ConfirmationModal);

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  modalContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: Colors.bg,
  },
  title: {color: Colors.txt, marginBottom: 10, textAlign: 'center'},
  desc: {
    color: Colors.txt,
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  btn: {
    flex: 1,
  },
});
