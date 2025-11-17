import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { Colors } from '../theme/color';
import style from '../theme/style';

const SelectorModal = ({
  visible,
  onClose,
  data = [],
  value,
  onSelect,
  label = 'Select Option',
  creatable = false,
  loading = false,
  searchPlaceholder = 'Search',
  formData,
  setFormData,
  name,
  searchable = false,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [customItems, setCustomItems] = useState([]);
  const [allData, setAllData] = useState([]);
  const searchInputRef = useRef(null);
  const customItemsRef = useRef([]);

  // Update allData whenever data or customItems change
  useEffect(() => {
    const combinedData = [...customItems, ...data];
    setAllData(combinedData);
  }, [data, customItems]);

  useEffect(() => {
    if (visible) {
      setSearchText('');
      // If there's a current value that's not in the data, it might be a custom item
      // Add it to custom items for this session
      if (
        value &&
        !data.some(item => item.id === value || item.value === value)
      ) {
        const customItem = {
          id: value,
          title: value,
        };
        const existingCustomItems = customItemsRef.current;
        const itemExists = existingCustomItems.some(item => item.id === value);
        if (!itemExists) {
          const updatedCustomItems = [customItem, ...existingCustomItems];
          setCustomItems(updatedCustomItems);
          customItemsRef.current = updatedCustomItems;
        } else {
          setCustomItems(existingCustomItems);
        }
      } else {
        setCustomItems(customItemsRef.current);
      }
      // Focus the search input when modal opens
      if (searchable) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 300);
      }
    } else {
      // Clear custom items when modal closes
      setCustomItems([]);
      customItemsRef.current = [];
    }
  }, [visible, value, data, searchable]);

  useEffect(() => {
    // Update filtered data whenever allData changes
    if (!searchable || searchText.trim() === '') {
      setFilteredData(allData);
    } else {
      const filtered = allData.filter(
        item =>
          item.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.label?.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [searchText, allData, searchable]);

  const handleSelect = item => {
    // Clear custom items when a different item is selected
    if (item.id !== value) {
      setCustomItems([]);
      customItemsRef.current = [];
    }
    onSelect(item);
    onClose();
  };

  const handleCreateNew = () => {
    if (creatable && searchText.trim()) {
      // Check if item already exists
      const existingItem = allData.find(
        item =>
          item.title?.toLowerCase() === searchText.toLowerCase() ||
          item.label?.toLowerCase() === searchText.toLowerCase(),
      );

      if (!existingItem) {
        // Create new item object
        const newItem = {
          id: searchText.trim(),
          title: searchText.trim(),
        };

        // Add to custom items for this session only
        const updatedCustomItems = [newItem, ...customItems];
        setCustomItems(updatedCustomItems);
        customItemsRef.current = updatedCustomItems;

        // Update form data if formData and setFormData are provided
        if (formData && setFormData && name) {
          setFormData(prev => ({
            ...prev,
            [name]: newItem.id,
          }));
        }

        // Call onSelect with the new item
        onSelect(newItem);
        onClose();
      } else {
        // If item already exists, just select it
        onSelect(existingItem);
        onClose();
      }
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = value === item.id || value === item.value;

    return (
      <TouchableOpacity
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}>
        <Text
          style={[
            style.m14,
            styles.itemText,
            isSelected && styles.selectedItemText,
          ]}>
          {item.title || item.label}
        </Text>
        {isSelected && <Icon name="check" size={20} color={Colors.primary} />}
      </TouchableOpacity>
    );
  };

  const renderCreateNew = () => {
    if (
      !creatable ||
      !searchText.trim() ||
      filteredData.some(
        item =>
          (item.title || item.label)?.toLowerCase() ===
          searchText.toLowerCase(),
      )
    ) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.createNewContainer}
        onPress={handleCreateNew}
        activeOpacity={0.7}>
        <Icon name="plus" size={20} color={Colors.primary} />
        <Text style={[style.m14, styles.createNewText]}>
          Create "{searchText.trim()}"
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={[style.m14, styles.emptyText]}>Loading...</Text>
        </View>
      );
    }

    if (searchText.trim() && filteredData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[style.m14, styles.emptyText]}>
            No options found for "{searchText.trim()}"
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[style.m14, styles.emptyText]}>No options available</Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}>
            <Icon name="arrow-left" size={24} color={Colors.txt} />
          </TouchableOpacity>
          <Text style={[style.s18, styles.headerTitle]}>{label}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Input */}
        {searchable && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Icon
                name="search"
                size={20}
                color={Colors.disable}
                style={styles.searchIcon}
              />
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder={searchPlaceholder}
                placeholderTextColor={Colors.disable}
                value={searchText}
                onChangeText={setSearchText}
                autoCorrect={false}
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setSearchText('')}
                  activeOpacity={0.7}>
                  <Icon name="x" size={16} color={Colors.disable} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Options List */}
        <View style={styles.listContainer}>
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item.id?.toString() || item.value?.toString() || index.toString()
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            ListHeaderComponent={
              creatable &&
              searchText.trim() &&
              !filteredData.some(
                item =>
                  (item.title || item.label)?.toLowerCase() ===
                  searchText.toLowerCase(),
              )
                ? renderCreateNew()
                : null
            }
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    color: Colors.txt,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: Colors.bord,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.txt,
    fontFamily: 'Poppins-Regular',
  },
  clearButton: {
    padding: 8,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  selectedItem: {
    backgroundColor: Colors.primary + '10',
  },
  itemText: {
    color: Colors.txt,
    flex: 1,
  },
  selectedItemText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  createNewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.primary + '05',
  },
  createNewText: {
    color: Colors.primary,
    marginLeft: 10,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: Colors.disable,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SelectorModal;
