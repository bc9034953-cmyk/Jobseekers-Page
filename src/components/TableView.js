import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Row, Table} from 'react-native-table-component';
import {Colors} from '../theme/color';
import style from '../theme/style';

export default function TableView({tableHeadData, tableBodyData, widthArr}) {
  return (
    <ScrollView horizontal={true} contentContainerStyle={{paddingBottom: 30}}>
      <View>
        <Table borderStyle={{borderWidth: 1, borderColor: Colors.divider}}>
          <Row
            data={tableHeadData}
            widthArr={widthArr}
            style={styles.header}
            textStyle={styles.headText}
          />
        </Table>
        <ScrollView style={styles.dataWrapper}>
          <Table borderStyle={{borderWidth: 1, borderColor: Colors.divider}}>
            {tableBodyData?.map((rowData, index) => (
              <Row
                key={index}
                data={rowData}
                widthArr={widthArr}
                style={[styles.row, index % 2 && {backgroundColor: '#f7f7f7'}]}
                textStyle={styles.text}
              />
            ))}
          </Table>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    paddingTop: 20,
    backgroundColor: Colors.white,
  },
  header: {height: 50, backgroundColor: '#f2f2f2'},
  text: {...style.r14, color: Colors.txt2, textAlign: 'center'},
  headText: {
    ...style.m14,
    textAlign: 'center',
    color: Colors.txt,
  },
  dataWrapper: {marginTop: -1},
  row: {minHeight: 50, backgroundColor: Colors.white},
});
