/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../theme/color';
import style from '../../theme/style';
import IntroItem from './IntroItem';
import Slides from './Slides';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('screen').width;

export default function 














Introduction() {
  const navigation = useNavigation();
  const ref = React.useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNavigate = () => {
    navigation.navigate('On1');
    AsyncStorage.setItem('has_introduction_completed', 'yes');
  };

  const Footer = () => {
    return (
      <View
        style={{
          backgroundColor: Colors.bg,
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 30,
          paddingHorizontal: 20,
        }}>

                 {/*for go back button*/}

        <View style={{}}>
          {currentSlideIndex === 0 ? (
            <TouchableOpacity
              style={[
                style.icon,
                {
                  borderColor: Colors.icon,
                  borderWidth: 1,
                  backgroundColor: Colors.bg,
                },
              ]}>
              <Icon name="arrow-back" size={24} color="#767676" />
            </TouchableOpacity>
          ) : currentSlideIndex === 1 ? (
            <TouchableOpacity
              onPress={goBackSlide}
              style={[
                style.icon,
                {
                  borderColor: Colors.icon,
                  borderWidth: 1,
                  backgroundColor: Colors.bg,
                },
              ]}>
              <Icon name="arrow-back" size={24} color="#767676" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={goBackSlide}
              style={[
                style.icon,
                {
                  borderColor: Colors.icon,
                  borderWidth: 1,
                  backgroundColor: Colors.bg,
                },
              ]}>
              <Icon name="arrow-back" size={24} color="#767676" />
            </TouchableOpacity>
          )}
        </View>


                              {/* for bottom status baar based on  the page index */}
        <View style={{flexDirection: 'row', justifyContent: 'center', flex: 1}}>
          {Slides.map((_, index) => (
            <View
              key={index}
              style={[
                style.indicator,
                currentSlideIndex === index && {
                  borderColor: Colors.primary,
                  borderWidth: 1,
                  paddingVertical: 2,
                  paddingHorizontal: 15,
                  borderRadius: 10,
                  backgroundColor: Colors.primary,
                  alignItems: 'center',
                  marginHorizontal: 5,
                },
              ]}
            />
          ))}
        </View>

                               {/* for Go next button */}

        <View style={{}}>
          {currentSlideIndex === 0 ? (
            <TouchableOpacity
              onPress={goNextSlide}
              style={[style.icon, {backgroundColor: Colors.primary}]}>
              <Icon name="arrow-forward" size={24} color={Colors.secondary} />
            </TouchableOpacity>
          ) : currentSlideIndex === 1 ? (
            <TouchableOpacity
              onPress={goNextSlide}
              style={[style.icon, {backgroundColor: Colors.primary}]}>
              <Icon name="arrow-forward" size={24} color={Colors.secondary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleNavigate}
              style={[style.icon, {backgroundColor: Colors.primary}]}>
              <Icon name="arrow-forward" size={24} color={Colors.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex !== Slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current?.scrollToOffset({offset});
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  const goBackSlide = () => {
    const nextSlideIndex = currentSlideIndex - 1;
    if (nextSlideIndex !== Slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current?.scrollToOffset({offset});
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={Slides}
        ref={ref}
        renderItem={({item}) => <IntroItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={updateCurrentSlideIndex}
      />
      <Footer />
    </SafeAreaView>
  );
}
