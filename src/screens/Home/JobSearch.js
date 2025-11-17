import {
  BackHandler,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect, Fragment} from 'react';
import style from '../../theme/style';
import {Colors} from '../../theme/color';
import Icon from 'react-native-vector-icons/Ionicons';
import {jobsApiSlice} from '../api-slices/jobs-api-slice';
import {ActivityIndicator, Divider} from '@react-native-material/core';
import {useNavigation, useRoute} from '@react-navigation/native';

const height = Dimensions.get('window').height;

export default function JobSearch({setQuery, query}) {
  const navigation = useNavigation();
  const route = useRoute();

  const [keyword, setKeyword] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isDDItemClicked, setIsDDItemClicked] = useState(false);

  const params = {...(keyword && {'JobsSearch[q]': keyword}), 'per-page': 30};

  const {
    data: jobs,
    isLoading,
    isFetching,
  } = jobsApiSlice.useGetJobsQuery(params, {skip: isDDItemClicked});

  useEffect(() => {
    if (keyword?.length > 0) {
      setIsDDItemClicked(false);
    }
  }, [keyword]);

  useEffect(() => {
    if (route?.params?.keyword) {
      setKeyword(route.params.keyword);
    }
  }, [route]);

  useEffect(() => {
    const backAction = () => {
      if (isFocused) {
        setIsFocused(false);
        return true; // Prevent default behavior (closing the app)
      }
      return false; // Let the default behavior occur (back button functionality)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isFocused]);

  const highlightMatchingText = (title, searchText) => {
    const index = title?.toLowerCase().indexOf(searchText?.toLowerCase());
    if (index === -1) {
      return <Text>{title}</Text>;
    }

    const beforeMatch = title.substring(0, index);
    const matchText = title.substring(index, index + searchText.length);
    const afterMatch = title.substring(index + searchText.length);

    return (
      <Text>
        {beforeMatch}
        <Text style={{color: Colors.txt}}>{matchText}</Text>
        {afterMatch}
      </Text>
    );
  };

  const handleClear = () => {
    setIsFocused(false);
    setKeyword(null);
  };

  const handleSelectItem = item => {
    setKeyword(item?.job_title);
    if (setQuery) {
      setQuery(item?.job_title);
    }
    setIsDDItemClicked(true);
    setIsFocused(false);
    navigation.navigate('JobListing', {keyword: item?.job_title});
  };

  const handleSubmit = () => {
    setIsFocused(false);
    navigation.navigate('JobListing', {keyword});
    if (setQuery) {
      setQuery(keyword);
    }
  };

  return (
    <View style={styles.main}>
      <View style={[style.shadow, style.inputContainer, styles.inputContainer]}>
        <Icon name="search" size={24} color={Colors.active} />
        <TextInput
          placeholder="Search jobs"
          placeholderTextColor={Colors.disable2}
          selectionColor={Colors.primary}
          value={keyword}
          onChangeText={setKeyword}
          autoFocus={true}
          onPressIn={() => setIsFocused(true)}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          style={[style.r14, styles.input]}
        />

        {isFocused && (isLoading || isFetching) ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : isFocused ? (
          <Pressable onPress={handleClear}>
            <Icon name="close" size={20} color={Colors.disable} />
          </Pressable>
        ) : null}
      </View>

      {isFocused && jobs?.length > 0 && (
        <View style={[style.shadow, styles.dropdown]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {jobs?.map(item => (
              <Fragment key={item?.id}>
                <TouchableOpacity
                  onPress={() => handleSelectItem(item)}
                  style={styles.touchableBtn}>
                  <Text style={styles.title}>
                    {highlightMatchingText(item?.job_title, keyword)}
                  </Text>
                </TouchableOpacity>

                <Divider />
              </Fragment>
            ))}

            {jobs?.length === 0 && (
              <Text style={styles.nothingFound}>No results found</Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {padding: 5, marginTop: 5, marginBottom: 0},
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
  dropdown: {
    maxHeight: height / 3.5,
    position: 'absolute',
    backgroundColor: '#fff',
    top: 65,
    left: 5,
    right: 5,
    zIndex: 10,
    borderRadius: 15,
  },
  touchableBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  title: {
    color: Colors.disable,
    fontSize: 13,
    fontWeight: '500',
  },
  nothingFound: {
    color: Colors.txt,
    paddingHorizontal: 15,
    paddingVertical: 15,
    textAlign: 'center',
  },
});
