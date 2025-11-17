import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppLoader from '../../../components/AppLoader';
import TableView from '../../../components/TableView';
import {getParsedJson, isPlanExpired} from '../../../utils';
import {checkoutApiSlice} from '../../api-slices/checkout-api-slice';

export default function CreditBuyListing() {
  const tableHead = [
    '#',
    'Order Id',
    'Plan Name',
    'Plan Amount',
    'Credits',
    'Purchase Date',
    'Expiry Date',
    'Is Expired',
  ];

  const [tableData, setTableData] = useState([]);

  const widthArr = [40, 170, 200, 130, 90, 130, 120, 100];

  const {data, isLoading, isFetching} =
    checkoutApiSlice.useGetCreditsHistoryQuery('credit');

  const getPlanAmount = amount => {
    if (amount) {
      return (
        <Text style={{alignSelf: 'center', minWidth: 60}}>
          {`Rs. ${parseInt(amount, 10)}`}
        </Text>
      );
    }

    return 'N/A';
  };

  useEffect(() => {
    if (data?.length > 0) {
      let newData = [];

      data?.forEach((item, index) => {
        const parsedData = getParsedJson(item?.payload);

        newData.push([
          index + 1,
          parsedData?.order_id || 'N/A',
          parsedData?.plan_name || 'N/A',
          getPlanAmount(parsedData?.plan_amount),
          item?.credit_value,
          moment(parsedData?.created_at).format('DD/MM/YYYY'),
          moment(parsedData?.expiry_date).format('DD/MM/YYYY'),
          isPlanExpired(item?.expiry_date) ? 'Yes' : 'No',
        ]);
      });

      setTableData(newData);
    }
  }, [data]);

  if (isLoading || isFetching) {
    return <AppLoader />;
  }

  return (
    <View style={styles.container}>
      <TableView
        tableHeadData={tableHead}
        tableBodyData={tableData}
        widthArr={widthArr}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 0, paddingTop: 20, backgroundColor: '#fff'},
});
