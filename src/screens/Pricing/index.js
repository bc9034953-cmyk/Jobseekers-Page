import {ScrollView, Text, View} from 'react-native';
import React, {useState} from 'react';
import ScreenLayout from '../ScreenLayout';
import style from '../../theme/style';
import {Colors} from '../../theme/color';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';
import PlanItem from './PlanItem';
import {baseApi} from '../baseApi';

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const navigation = useNavigation();

  const {data: plans, isLoading} = baseApi.useGetPlansQuery();

  return (
    <ScreenLayout title="Pricing" centerTitle isLoading={isLoading}>
      <View style={{flex: 1}}>
        <Text
          style={[
            style.s16,
            {textAlign: 'center', color: Colors.txt, marginTop: 15},
          ]}>
          Choose your plan
        </Text>

        <Text style={[style.m13, {textAlign: 'center', marginBottom: 15}]}>
          Purchase credits to view candidates profiles
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 40}}>
          {plans?.map(plan => (
            <PlanItem
              plan={plan}
              key={plan?.id}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
            />
          ))}
        </ScrollView>
      </View>

      {selectedPlan && (
        <Button
          styles={{marginVertical: 15}}
          onPress={() =>
            navigation.navigate('Checkout', {planId: selectedPlan?.id})
          }>
          Purchase Now
        </Button>
      )}
    </ScreenLayout>
  );
}
