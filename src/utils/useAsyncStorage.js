import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAsyncStorage = (key, isResponseTypeString) => {
  const [storageItem, setStorageItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStorageItem = useCallback(async () => {
    try {
      const retrievedItem = await AsyncStorage.getItem(key);

      let item = null;

      if (isResponseTypeString) {
        item = retrievedItem ? retrievedItem : null;
      } else {
        item = retrievedItem ? JSON.parse(retrievedItem) : null;
      }

      setStorageItem(item);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [isResponseTypeString, key]);

  const fetchData = () => {
    loadStorageItem();
  };

  useEffect(() => {
    loadStorageItem();
  }, [key, loadStorageItem]);

  return {value: storageItem, loading, error, fetchData};
};

export default useAsyncStorage;
