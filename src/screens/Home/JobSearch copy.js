import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import style from '../../theme/style';
import {Colors} from '../../theme/color';
import Icon from 'react-native-vector-icons/Ionicons';
import {jobsApiSlice} from '../api-slices/jobs-api-slice';
import {ActivityIndicator, Divider} from '@react-native-material/core';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import {RemoteDataSetExample2} from './RemoteDataSetExample2';

const height = Dimensions.get('window').height;

export default function JobSearch() {
  const [search, setSearch] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownController = useRef(null);
  console.log('dropdownController::', dropdownController.current);

  // const [searchJobs, {isLoading, isFetching}] =
  //   jobsApiSlice.useSearchJobsMutation();
  // const [jobs, setJobs] = useState([]);

  const {data, isLoading, isFetching} = jobsApiSlice.useGetJobsQuery();
  const jobs = data?.map(item => ({...item, title: item?.job_title}));

  // useEffect(() => {
  //   const handleSearch = async () => {
  //     setIsFocused(true);
  //     try {
  //       const response = await searchJobs(search).unwrap();

  //       setJobs(response?.map(item => ({...item, title: item?.job_title})));

  //       console.log('response::', response?.length);
  //     } catch (error) {
  //       console.log('error::', error);
  //     }
  //   };

  //   if (search) {
  //     handleSearch();
  //   }
  // }, [search, searchJobs]);

  // console.log('data::', data?.length, isLoading);

  // useEffect(() => {
  //   const backAction = () => {
  //     if (isFocused) {
  //       setIsFocused(false);
  //       return true; // Prevent default behavior (closing the app)
  //     }

  //     return false; // Let the default behavior occur (back button functionality)
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, [isFocused]);

  const [selectedItem, setSelectedItem] = useState(null);

  const handleClear = () => {
    setIsFocused(false);
    setSearch(null);
  };

  const handleBlur = () => {
    console.log('pressed::');
    dropdownController.current.close();
  };

  const highlightMatchingText = (title, searchText) => {
    const index = title.toLowerCase().indexOf(searchText.toLowerCase());
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

  return (
    <View
      style={{
        padding: 5,
        marginTop: 5,
        marginBottom: 0,
        height: 300,
      }}>
      {/* <View
        style={[
          style.shadow,
          style.inputContainer,
          {
            height: 50,
            backgroundColor: Colors.bg,
            shadowColor: Colors.active,
          },
        ]}>
        <Icon name="search" size={24} color={Colors.active} />
        <TextInput
          placeholder="Search job here..."
          placeholderTextColor={Colors.disable2}
          selectionColor={Colors.primary}
          value={search}
          onChangeText={setSearch}
          onPressIn={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            style.r14,
            {
              color: Colors.active,
              marginLeft: 5,
              marginTop: 4,
              flex: 1,
            },
          ]}
        />

        {isLoading || isFetching ? (
          <ActivityIndicator size="small" />
        ) : search ? (
          <Pressable onPress={handleClear}>
            <Icon name="close" size={20} color={Colors.disable} />
          </Pressable>
        ) : null}
      </View> */}
      {/* {isFocused && jobs?.length > 0 && (
        <View
          style={{
            maxHeight: height / 3.5,
            position: 'absolute',
            backgroundColor: '#fff',
            top: 65,
            left: 5,
            right: 5,
            zIndex: 10,
            borderRadius: 8,
            elevation: 2,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {jobs?.map(item => (
              <TouchableOpacity
                key={item?.id}
                style={{paddingHorizontal: 10, paddingVertical: 8}}>
                <Text style={{color: '#000'}}>{item?.job_title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )} */}

      <AutocompleteDropdown
        clearOnFocus={false}
        closeOnBlur={false}
        controller={controller => (dropdownController.current = controller)}
        EmptyResultComponent={
          <Text style={{color: Colors.txt, padding: 15, textAlign: 'center'}}>
            No results found
          </Text>
        }
        suggestionsListContainerStyle={{borderRadius: 15, marginTop: 5}}
        onChangeText={setSearch}
        textInputProps={{
          placeholder: 'Search job here...',
          style: {
            color: Colors.txt,
          },
        }}
        inputContainerStyle={[
          style.shadow,
          style.inputContainer,
          {
            height: 50,
            backgroundColor: Colors.bg,
            shadowColor: Colors.active,
          },
        ]}
        ItemSeparatorComponent={<Divider />}
        renderItem={(item, text) => {
          return (
            <Text
              style={{
                color: Colors.disable1,
                paddingHorizontal: 17,
                paddingVertical: 12,
              }}>
              {highlightMatchingText(item.title, text)}
            </Text>
          );
        }}
        showChevron={false}
        closeOnSubmit={true}
        onSelectItem={setSelectedItem}
        dataSet={jobs}
      />

      {dropdownController.current && (
        <Pressable
          onPress={handleBlur}
          style={{borderWidth: 2, borderColor: 'red', height: height}}>
          <View style={styles.overlayStyle} />
        </Pressable>
      )}

      {/* <RemoteDataSetExample2 /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  overlayStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'green',
    height: height,
  },
  // ... your other styles
});
