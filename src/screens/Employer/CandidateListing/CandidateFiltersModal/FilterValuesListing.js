import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../../../theme/color';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/Ionicons';
import style from '../../../../theme/style';
import {setTempSelectedFilters} from './candidates-slice';
import {useDispatch, useSelector} from 'react-redux';

export default function FilterValuesListing({
  data,
  name,
  showSearchBox = true,
}) {
  const [selectedFilterItem, setSelectedFilterItem] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const candidates = useSelector(state => state.candidates);
  const tempSelectedFilters = candidates?.tempSelectedFilters;

  // Function to filter data based on the search term
  const getFilteredData = () => {
    if (!searchTerm.trim()) {
      return data;
    }
    return data.filter(item =>
      item?.name.toLowerCase()?.includes(searchTerm.toLowerCase()),
    );
  };

  const toggleItem = (id, title) => {
    const updatedData = () => {
      const entryWithSameName = tempSelectedFilters.find(
        entry => entry.name === name,
      );

      if (entryWithSameName) {
        // If the current name is the same but ID is different,
        // update only the id of the existing entry
        if (entryWithSameName.value !== id) {
          return tempSelectedFilters.map(entry =>
            entry.name === name ? {...entry, value: id, title} : entry,
          );
        } else {
          // Name and ID are the same, remove from array using filter
          return tempSelectedFilters.filter(
            entry => !(entry.name === name && entry.value === id),
          );
        }
      } else {
        // Name is different, add a new object with name and value
        return [...tempSelectedFilters, {name: name, value: id, title}];
      }
    };

    dispatch(setTempSelectedFilters(updatedData()));

    setSelectedFilterItem({[id]: !selectedFilterItem[id]});
  };

  useEffect(() => {
    const selectedItem = tempSelectedFilters?.find(item => item.name === name);
    if (selectedItem) {
      setSelectedFilterItem({[selectedItem.value]: true});
    } else {
      setSelectedFilterItem({});
    }
  }, [name, tempSelectedFilters]);

  return (
    <View style={{flex: 1}}>
      {showSearchBox && (
        <View style={{position: 'relative'}}>
          <TextInput
            placeholder="Search"
            style={styles.input}
            placeholderTextColor={Colors.disable}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          {searchTerm && (
            <Pressable
              onPress={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: 6,
                top: 13,
                width: 22,
                height: 22,
              }}>
              <Icon name="close" size={20} color={Colors.disable} />
            </Pressable>
          )}
        </View>
      )}

      <FlatList
        data={getFilteredData()}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={{marginVertical: 10}}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={{color: Colors.txt, padding: 20, textAlign: 'center'}}>
            No data found
          </Text>
        }
        renderItem={({item}) => (
          <TouchableOpacity
            key={`${name}-${item?.id}`}
            style={styles.item}
            onPress={() => toggleItem(item.id, item?.name)}>
            <CheckBox
              value={selectedFilterItem[item.id]}
              tintColors={{true: Colors.primary, false: 'gray'}}
              onValueChange={() => toggleItem(item.id, item?.name)}
            />
            <Text style={[style.m12, {color: Colors.txt, marginLeft: 5}]}>
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.divider,
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    color: Colors.txt,
    paddingRight: 32,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    width: '80%',
  },
});
