import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {Colors} from '../../../theme/color';
import RBSheet from 'react-native-raw-bottom-sheet';
import style from '../../../theme/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {jobsApiSlice} from '../../api-slices/jobs-api-slice';
import FilterValuesListing from './FilterValuesListing';
import {
  filterTabMenu,
  experienceData,
  jobTypeData,
  datePostedData,
} from './FilterCategoriesData';
import {useDispatch, useSelector} from 'react-redux';
import {setJobFilters} from './job-filters-slice';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function JobFiltersModal({filterParams, setFilterParams}) {
  const [activeMenu, setActiveMenu] = useState('job_location_id');
  const [selectedFilters, setSelectedFilters] = useState([]);
  // console.log('activeFilter::', activeMenu);
  // console.log('selectedFilters::', selectedFilters);
  // console.log('filterParams::', filterParams);
  const dispatch = useDispatch();
  const [isModalOpened, setIsModalOpened] = useState(false);
  // console.log('isModalOpened::', isModalOpened);
  // console.log('activeMenu::', activeMenu);

  const jobFilters = useSelector(state => state.jobFilters.filters);

  const {data: jobLocations} = jobsApiSlice.useGetJobLocationsQuery();
  const {data: jobCategories} = jobsApiSlice.useGetJobCategoriesQuery();

  const handleApply = () => {
    const params =
      selectedFilters?.reduce((obj, item) => {
        obj[`JobsSearch[${item.name}]`] = item.value;
        return obj;
      }, {}) || {};

    setFilterParams(params);
    dispatch(setJobFilters(selectedFilters));

    this.RBSheet.close();
  };

  const renderFilterList = () => {
    switch (activeMenu) {
      case 'job_category_id':
        return (
          <FilterValuesListing
            data={jobCategories}
            setSelectedFilters={setSelectedFilters}
            selectedFilters={selectedFilters}
            name="job_category_id"
          />
        );
      case 'work_experience':
        return (
          <FilterValuesListing
            data={experienceData}
            setSelectedFilters={setSelectedFilters}
            selectedFilters={selectedFilters}
            name="work_experience"
          />
        );
      case 'job_type':
        return (
          <FilterValuesListing
            data={jobTypeData}
            setSelectedFilters={setSelectedFilters}
            selectedFilters={selectedFilters}
            name="job_type"
          />
        );
      case 'created_within_hours':
        return (
          <FilterValuesListing
            data={datePostedData}
            setSelectedFilters={setSelectedFilters}
            selectedFilters={selectedFilters}
            name="created_within_hours"
          />
        );
      case 'search_keywords':
        return (
          <FilterValuesListing
            data={[]}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            name="search_keywords"
          />
        );

      default:
        return (
          <FilterValuesListing
            data={jobLocations}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            name="job_location_id"
          />
        );
    }
  };

  const appliedFilterCount = item => {
    const hasFilterApplied = selectedFilters?.find(
      data => data?.name === item?.id,
    );

    if (hasFilterApplied) {
      return <Text style={style.m12}>1</Text>;
    }
  };

  // console.log('::', );

  const handleFilterPress = item => {
    if (!isModalOpened) {
      this.RBSheet.open();
      setActiveMenu(item?.id);
    }
  };

  const onModalClose = () => {
    setIsModalOpened(false);
    setActiveMenu('job_location_id');
  };

  const getFilterDetails = item => {
    const matchedFilter = jobFilters?.find(filter => filter?.name === item?.id);
    return {
      isApplied: Boolean(matchedFilter),
      label: matchedFilter?.title || item?.title,
    };
  };

  return (
    <>
      <View style={{marginVertical: 10, flexDirection: 'row', gap: 12}}>
        <TouchableOpacity
          onPress={() => this.RBSheet.open()}
          style={[styles.filterIcon]}>
          <Icon name="filter" size={16} color={Colors.active} />
          {Object.keys(filterParams)?.length > 0 && <View style={styles.dot} />}
        </TouchableOpacity>

        <ScrollView horizontal>
          <View style={{flexDirection: 'row', gap: 10}}>
            {filterTabMenu?.map(item => {
              const {isApplied, label} = getFilterDetails(item);
              return (
                <TouchableOpacity
                  style={[styles.filterPill, isApplied && styles.activePill]}
                  key={item?.id}
                  onPress={() => handleFilterPress(item)}>
                  <Text
                    style={[styles.txt, isApplied && styles.activePillText]}>
                    {label}
                  </Text>
                  <Icon
                    name="chevron-down"
                    size={18}
                    color={isApplied ? '#fff' : Colors.active}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        height={height / 1.2}
        onOpen={() => setIsModalOpened(true)}
        onClose={onModalClose}
        openDuration={200}
        animationType="slide"
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            backgroundColor: Colors.bg,
          },
        }}>
        <StatusBar
          backgroundColor={'rgba(255,255,255, .42)'}
          animated
          showHideTransition={'fade'}
        />

        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingRight: 20,
              }}>
              <View
                style={{
                  padding: 15,
                  flexDirection: 'row',
                  gap: 15,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => this.RBSheet.close()}
                  style={[style.icon]}>
                  <Ionicons name="arrow-back" size={24} color={Colors.active} />
                </TouchableOpacity>

                <Text style={[style.s18, {color: Colors.txt}]}>
                  All Filters
                </Text>
              </View>

              <TouchableOpacity onPress={() => setSelectedFilters([])}>
                <Text style={[style.s12, {color: Colors.primary}]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>

            {/* <ScrollView
              horizontal
              style={{
                marginBottom: 15,
                paddingHorizontal: 12,
                backgroundColor: 'red',
              }}>
              {selectedFilters?.map((item, index) => (
                <View
                  style={[
                    styles.filterPill,
                    {marginRight: 30, backgroundColor: 'green'},
                  ]}
                  key={`applied-filter-${index}`}>
                  <Text style={styles.txt}>{item?.title}</Text>
                  <TouchableOpacity>
                    <Ionicons name="close" size={16} color={Colors.disable} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView> */}
          </View>

          <View
            style={{
              flex: 1,
              // backgroundColor: 'red',
              flexDirection: 'row',
            }}>
            <View style={styles.leftView}>
              <ScrollView>
                {filterTabMenu?.map(item => {
                  const activeItem = item?.id === activeMenu;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.menuTab,
                        {
                          backgroundColor: activeItem ? '#fff' : 'transparent',
                        },
                      ]}
                      onPress={() => setActiveMenu(item.id)}>
                      {activeItem && <View style={styles.menuTabBorder} />}
                      <Text
                        style={[
                          style.m14,
                          {
                            color: Colors.txt,
                            fontSize: 13,
                          },
                        ]}>
                        {item.title}
                      </Text>

                      {appliedFilterCount(item)}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.rightView}>
              {renderFilterList()}

              <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                <Text style={{color: '#fff'}}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </RBSheet>
    </>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 7,
    height: 7,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  filterIcon: {
    borderWidth: 1,
    borderColor: Colors.bord,
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  filterPill: {
    borderWidth: 1,
    borderColor: Colors.bord,
    height: 38,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 5,
  },
  activePill: {
    backgroundColor: Colors?.primary,
  },
  activePillText: {
    color: '#fff',
  },
  txt: {
    color: Colors.txt,
    fontSize: 13,
    lineHeight: 15,
  },
  leftView: {
    backgroundColor: Colors.iconbg,
    width: width / 2.5,
    height: '100%',
  },
  menuTab: {
    paddingHorizontal: 12,
    minHeight: 50,
    paddingVertical: 10,
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  menuTabBorder: {
    backgroundColor: Colors.primary,
    width: 4,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  rightView: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 120,
    minWidth: 100,
    alignSelf: 'flex-end',
    marginRight: 15,
  },
});
