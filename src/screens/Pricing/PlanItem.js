import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Colors} from '../../theme/color';
import style from '../../theme/style';
import {toArray} from '../../utils';
import Icon from 'react-native-vector-icons/Ionicons';

export default function PlanItem({
  plan,
  selectedPlan,
  setSelectedPlan = () => {},
  isTouchable = true,
}) {
  const getList = list => {
    let listArr = toArray(list, '\n');

    return listArr.map((h, index) => (
      <View
        key={'list-' + index}
        style={{
          flexDirection: 'row',
          marginTop: 5,
        }}>
        <Icon
          name="checkmark-circle"
          size={14}
          style={{marginTop: 3}}
          color={Colors.primary}
        />
        <Text
          style={[style.r13, {marginLeft: 8, flex: 1, color: Colors.disable}]}>
          {h}
        </Text>
      </View>
    ));
  };

  return (
    <View>
      <TouchableOpacity
        {...(!isTouchable && {activeOpacity: 1})}
        style={[
          styles.card,
          {
            marginBottom: 20,
            borderColor:
              selectedPlan?.id === plan?.id ? Colors.primary : Colors.divider,
            position: 'relative',
          },
        ]}
        onPress={() => setSelectedPlan(plan)}>
        {/* TODO: In future if we need to show recommended plan then uncomment this code */}
        {/* {plan?.recommended && (
              <View
                style={{
                  backgroundColor: Colors.primary,
                  position: 'absolute',
                  paddingHorizontal: 8,
                  right: 15,
                  top: -10,
                  borderRadius: 5,
                  opacity: 1,
                }}>
                <Text style={[style.r12, {color: '#fff'}]}>Recommended</Text>
              </View>
        )} */}
        <Text style={[style.s22]}>₹{parseInt(plan?.plan_amount, 10)}</Text>
        <Text style={[style.m14, {color: Colors.txt}]}>{plan?.name}</Text>

        {getList(plan?.description)}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderColor: Colors.divider,
  },
});
