import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../theme/color';
import style from '../theme/style';
import {
  getCompanyLogo,
  getSalaryAmount,
  isUserEmployer,
  getJobTypeChipColor,
} from '../utils';
import CustomChip from './CustomChip';
import JobBookmark from './JobBookmark';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';

export default function SingleJobItem({
  job,
  jobTimeText = 'Posted',
  showActionButtons,
  handleActiveToggle,
  updateStatusLoading,
}) {
  const navigation = useNavigation();
  const isActive = job?.is_active === 1;

  const userData = useSelector(state => state.users.data);

  return (
   <TouchableOpacity
  onPress={() => navigation.navigate('JobDetail', {job})}
  style={styles.tab}
>
      <Image
        source={getCompanyLogo(job?.company?.logo)}
        resizeMode="stretch" 
        style={{height: 55, width: 55, borderRadius: 8}}
      />
      <View style={{marginLeft: 10, flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '80%'}}>
            <Text style={[style.r12, {color: '#212121'}]}>
              {job?.company?.name}
            </Text>
            <Text style={[style.s16, {color: Colors.active}]}>
              {job?.job_title}
            </Text>
          </View>

          {!isUserEmployer(userData) && (
            <View style={{marginTop: 5}}>
              <JobBookmark job={job} iconSize={20} />
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Image
            source={require('../../assets/image/s10.png')}
            resizeMode="stretch"
            style={{height: 20, width: 20}}
          />
          <Text style={[style.m14, {color: '#212121', marginLeft: 8}]}>
            {getSalaryAmount(job)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Image
            source={require('../../assets/image/s19.png')}
            resizeMode="stretch"
            style={{height: 20, width: 20, tintColor: Colors.primary}}
          />
          <Text style={[style.m14, {color: '#212121', marginLeft: 8}]}>
            {job?.location?.name || 'India'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 6,
            marginTop: 10,
            flexWrap: 'wrap',
          }}>
          {job?.job_type && (
            <CustomChip
              label={job.job_type}
              color={getJobTypeChipColor(job?.job_type)}
              variant="filled"
            />
          )}

          {job?.job_position && (
            <CustomChip
              label={job?.job_position}
              color={'#3f51b5'}
              variant="filled"
            />
          )}

          {job?.job_priority?.toLowerCase() === 'high' && (
            <CustomChip label={'Urgent'} color={'red'} variant="outlined" />
          )}

          {showActionButtons && (
            <View style={{flexDirection: 'row', gap: 5, marginTop: 10}}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('CandidateApplications', {
                    jobId: job?.id,
                  })
                }>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {job?.open_job_count || 0}
                  </Text>
                </View>
                <Text style={[style.m13, styles.tabText]}>
                  View Application
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('JobForm', {details: job})}>
                <Feather name="edit" color={Colors.txt} size={16} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.editBtn,
                  {backgroundColor: isActive ? Colors.green2 : Colors.red2},
                ]}
                disabled={updateStatusLoading}
                onPress={() => handleActiveToggle(job)}>
                {updateStatusLoading ? (
                  <ActivityIndicator size={18} color={Colors.txt} />
                ) : (
                  <Feather
                    name={isActive ? 'eye' : 'eye-off'}
                    color={Colors.txt}
                    size={16}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}

          <Text
            style={{
              color: Colors.disable,
              fontSize: 12,
              marginTop: 6,
              marginLeft: 5,
              width: '100%',
            }}>
            {jobTimeText} {moment(job?.created_at).fromNow()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 30,
    paddingHorizontal: 17,
    backgroundColor: '#ebe9fd',
    maxWidth: 170,
    width: 'auto',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{scale: 0.95}],
  },
  tabText: {
    lineHeight: 18,
    color: Colors.txt,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: 0,
    backgroundColor: Colors.red,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
  },
  editBtn: {
    backgroundColor: '#ebe9fd',
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{scale: 0.95}],
  },
  tab : {
    
    flexDirection: 'row',
    marginTop: 15,
    backgroundColor: '#fff',
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    marginHorizontal: 5,

    // ⭐ ONLY BOTTOM SHADOW
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },  // bottom only
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2, // Android bottom shadow only       
  }
});
