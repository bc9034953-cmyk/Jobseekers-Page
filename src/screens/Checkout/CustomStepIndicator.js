import {View} from 'react-native';
import React from 'react';
import StepIndicator from 'react-native-step-indicator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../theme/color';

export default function CustomStepIndicator({
  currentStep,
  labels,
  setCurrentStep = () => {},
}) {
  const customStyles = {
    stepIndicatorSize: 22,
    currentStepIndicatorSize: 25,
    separatorStrokeWidth: 2,
    stepStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: Colors.primary,
    stepStrokeFinishedColor: Colors.primary,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: Colors.primary,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: Colors.primary,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: Colors.primary,
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: Colors.txt,
    labelSize: 12,
    currentStepLabelColor: Colors.primary,
    labelFontFamily: 'Poppins-Medium',
  };

  const getIconColor = step => {
    if (step?.stepStatus === 'current') {
      return Colors.primary;
    }

    return step?.stepStatus === 'finished' ? Colors.white : Colors.disable;
  };

  return (
    <View style={{marginHorizontal: -10, marginTop: 12}}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentStep}
        labels={labels}
        stepCount={3}
        onPress={step => {
          if (currentStep > step) {
            setCurrentStep(step);
          }
        }}
        renderStepIndicator={step => (
          <View>
            <Ionicons name="checkmark" size={15} color={getIconColor(step)} />
          </View>
        )}
      />
    </View>
  );
}
