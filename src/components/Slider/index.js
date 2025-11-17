import React, {useCallback, useState} from 'react';
import {View, Text} from 'react-native';
import RNSlider from 'rn-range-slider';
import Thumb from './Thumb';
import Rail from './Rail';
import RailSelected from './RailSelected';
import Notch from './Notch';
import Label from './Label';

import styles from './styles';
import style from '../../theme/style';
import {Colors} from '../../theme/color';

const Slider = ({setFilteredPriceRange}) => {
  const initialMin = 1000;
  const initialMax = 100000;

  const [low, setLow] = useState(initialMin);
  const [high, setHigh] = useState(initialMax);
  const [min] = useState(initialMin);
  const [max] = useState(initialMax);

  // console.log('low::', low);

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(
    value => <Label text={value} prefix="₹" />,
    [],
  );
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((lowVal, highVal, isUpdate) => {
    if (isUpdate) {
      setLow(lowVal);
      setHigh(highVal);
    }
  }, []);

  const handleTouchEnd = () => {
    setFilteredPriceRange(low + '-' + high);
  };

  return (
    <View style={styles.root}>
      <View style={styles.labelView}>
        <Text style={[style.m14, {color: Colors.txt, minWidth: 80}]}>
          Rs.{low}
        </Text>
        <Text style={[style.m14, {color: Colors.txt, minWidth: 80}]}>
          Rs.{high}
        </Text>
      </View>

      <RNSlider
        style={styles.slider}
        min={min || 0}
        max={max || 1000}
        step={1}
        floatingLabel={true}
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        renderNotch={renderNotch}
        onValueChanged={handleValueChange}
        onTouchEnd={handleTouchEnd}
      />
    </View>
  );
};

export default Slider;

// https://github.com/githuboftigran/rn-range-slider/issues/139
/*Info: If slider has doesn't work on modal then update slider package manually from `onStartShouldSetPanResponderCapture: falseFunc` => `trueFunc`  */
