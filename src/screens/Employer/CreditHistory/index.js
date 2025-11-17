import React, {useState} from 'react';
import AppLoader from '../../../components/AppLoader';
import Tabs from '../../../components/Tabs';
import ScreenLayout from '../../ScreenLayout';
import {usersApiSlice} from '../../users-api-slice';
import CreditBuyListing from './CreditBuyListing';
import CreditSummary from './CreditSummary';

const tabData = [
  {label: 'Summary', value: 'Summary'},
  {label: 'Credit Buy History', value: 'Credit Buy History'},
];

export default function CreditHistory() {
  const [activeTab, setActiveTab] = useState('Summary');

  const {data: planDetails, isLoading} = usersApiSlice.useGetPlanDetailsQuery();

  const renderBody = () => {
    if (activeTab === 'Summary' && isLoading) {
      return <AppLoader />;
    }

    if (activeTab === 'Credit Buy History') {
      return <CreditBuyListing />;
    }

    return <CreditSummary planDetails={planDetails} />;
  };

  return (
    <ScreenLayout title="Credits & history">
      <Tabs
        tabData={tabData}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />

      {renderBody()}
    </ScreenLayout>
  );
}
