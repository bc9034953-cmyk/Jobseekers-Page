import React, {useState, useRef, useEffect} from 'react';
import {View, FlatList, StyleSheet, Dimensions, Image} from 'react-native';
import {bannersApiSlice} from '../api-slices/banners-api-slice';
import Configs from '../../utils/Configs';
import {Colors} from '../../theme/color';

const {width} = Dimensions.get('window');

const Banners = ({isUserEmployer}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const bannerCategory = isUserEmployer
    ? 'homepage_mobile_employers_banners'
    : 'homepage_mobile_banners';

  const {data} = bannersApiSlice.useGetBannersQuery(bannerCategory);

  const imageData =
    data?.map(item => ({
      image: `${Configs.DATA_URL}/banners/${item?.image}`,
    })) || [];

  // Method to change slide
  const scrollToIndex = index => {
    flatListRef.current.scrollToIndex({animated: true, index});
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (imageData.length > 0) {
      const interval = setInterval(() => {
        const nextIndex =
          currentIndex === imageData.length - 1 ? 0 : currentIndex + 1;
        scrollToIndex(nextIndex);
        setCurrentIndex(nextIndex);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [currentIndex, imageData.length]);

  // Render pagination indicators
  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {imageData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  if (data?.length === 0 || !data) {
    return null;
  }

  return (
    <View style={{marginBottom: 10}}>
      <FlatList
        ref={flatListRef}
        data={imageData}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({item}) => (
          <View style={styles.item}>
            <View style={styles.innerItem}>
              <Image
                source={{uri: item?.image}}
                style={{
                  width: '100%',
                  height: 150,
                  objectFit: 'cover',
                }}
              />
            </View>
          </View>
        )}
      />
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: width - 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 5,
    paddingTop: 10,
  },
  innerItem: {
    backgroundColor: '#eee',
    borderRadius: 20,
    width: '100%',
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 3,
  },
  dot: {
    width: 15,
    height: 7,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 30,
  },
  inactiveDot: {
    backgroundColor: Colors.bord, // Replace this with your inactive color
  },
});

export default Banners;
