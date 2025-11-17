import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../../theme/color';
import style from '../../../theme/style';

export default function CandidateSearch({setQuery, query}) {
  const route = useRoute();

  const [keyword, setKeyword] = useState(null);

  useEffect(() => {
    if (route?.params?.keyword) {
      setKeyword(route.params.keyword);
    }
  }, [route]);

  const handleClear = () => {
    setKeyword('');
    setQuery('');
  };

  const handleSubmit = () => {
    if (setQuery) {
      setQuery(keyword);
    }
  };

  return (
    <View style={styles.main}>
      <View style={[style.shadow, style.inputContainer, styles.inputContainer]}>
        <Icon name="search" size={24} color={Colors.active} />
        <TextInput
          placeholder="Search candidates here..."
          placeholderTextColor={Colors.disable2}
          selectionColor={Colors.primary}
          value={keyword}
          onChangeText={setKeyword}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          autoFocus={true}
          style={[style.r14, styles.input]}
        />

        {keyword && (
          <Pressable onPress={handleClear} style={styles.icon}>
            <Icon name="close" size={20} color={Colors.disable} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {padding: 5, marginTop: 5, marginBottom: 0, marginHorizontal: -7},
  input: {
    color: Colors.active,
    marginLeft: 5,
    marginTop: 4,
    flex: 1,
  },
  inputContainer: {
    height: 52,
    backgroundColor: Colors.bg,
    shadowColor: Colors.active,
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: -10,
    right: 0,
  },
});
