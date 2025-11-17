import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppLoader from '../../../components/AppLoader';
import TableView from '../../../components/TableView';
import {Colors} from '../../../theme/color';
import {getParsedJson} from '../../../utils';
import {checkoutApiSlice} from '../../api-slices/checkout-api-slice';
import useViewCandidateDetails from '../../../components/useViewCandidateDetails';
import {useNavigation} from '@react-navigation/native';

export default function CreditUsageListing() {
  const navigation = useNavigation();

  const tableHead = [
    '#',
    'Candidate Name',
    'Candidate Email',
    'Candidate Contact No.',
    'Candidate Resume',
    'Cover Letter',
    'View Date',
    'Credit Used',
    'Action',
  ];

  const [tableData, setTableData] = useState([]);

  const [getCustomerDetails, {isLoading: viewUserLoading}] =
    useViewCandidateDetails();

  const widthArr = [40, 170, 230, 180, 160, 160, 120, 120, 120];

  const {data, isLoading, isFetching} =
    checkoutApiSlice.useGetCreditsHistoryQuery('debit');

  const downloadButton = useCallback(
    (item, field = 'resume') => {
      return (
        <TouchableOpacity
          onPress={() =>
            getCustomerDetails(item?.candidate_id, 'downloadResume', field)
          }
          style={{
            alignItems: 'center',
            backgroundColor: 'transparent',
            padding: 10,
          }}>
          <Text style={[styles.text, {color: Colors.primary}]}>Download</Text>
        </TouchableOpacity>
      );
    },
    [getCustomerDetails],
  );

  const viewDetails = useCallback(
    candidateId => {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CandidateDetails', {id: candidateId})
          }
          style={{
            alignItems: 'center',
            backgroundColor: 'transparent',
            padding: 10,
          }}>
          <Text style={[styles.text, {color: Colors.primary}]}>
            View Details
          </Text>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  useEffect(() => {
    if (data?.length > 0) {
      let newData = [];

      data?.forEach((item, index) => {
        const parsedData = getParsedJson(item?.payload);

        newData.push([
          index + 1,
          parsedData?.candidate_name,
          parsedData?.candidate_email,
          parsedData?.candidate_mobile_number,
          downloadButton(parsedData),
          downloadButton(parsedData, 'cover_letter'),
          moment(parsedData?.created_at).format('DD/MM/YYYY'),
          item?.credit_value,
          viewDetails(parsedData?.candidate_id),
        ]);
      });

      setTableData(newData);
    }
  }, [data, downloadButton, viewDetails]);

  if (isLoading || isFetching) {
    return <AppLoader />;
  }

  return (
    <>
      {viewUserLoading && (
        <>
          <StatusBar
            backgroundColor={'rgba(255,255,255, .62)'}
            translucent={false}
            barStyle={'dark-content'}
          />
          <AppLoader v="v2" />
        </>
      )}

      <View style={styles.container}>
        <TableView
          tableHeadData={tableHead}
          tableBodyData={tableData}
          widthArr={widthArr}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 0, paddingTop: 20, backgroundColor: '#fff'},
});
