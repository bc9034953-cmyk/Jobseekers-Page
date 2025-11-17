import React from 'react';
import ScreenLayout from '../../ScreenLayout';
import CreditUsageListing from './CreditUsageListing';

const PurchasedCandidates = () => {
  return (
    <ScreenLayout title="Purchased Candidates">
      <CreditUsageListing />
    </ScreenLayout>
  );
};

export default PurchasedCandidates;
