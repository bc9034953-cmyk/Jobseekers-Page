import React, { useCallback, useState } from 'react';
import { usersApiSlice } from '../screens/users-api-slice';
import {
  convertToSlug,
  fileSaver,
  getFileExtension,
  getParsedJson,
  getTimestampInSeconds,
  isInsufficientCreditError,
  showError,
} from '../utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setCheckoutRedirectPath } from '../screens/users-slice';
import Configs from '../utils/Configs';
import ConfirmationModal from './ConfirmationModal';

export default function useViewCandidateDetails() {
  const [fullCustomerDetails, setFullCustomerDetails] = useState(null);
  const [isConfModalOpened, setIsConfModalOpened] = useState(false);
  const authToken = useSelector(state => state.users?.authToken);

  const route = useRoute();

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [isFileDownloading, setIsFileDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [getCustomerFullDetails, { isLoading }] =
    usersApiSlice.useGetCustomerFullDetailsMutation();

  const getDownloadFileName = (fileName, userName, field = 'resume') => {
    const slugifyUserName = `${convertToSlug(userName)}`;
    const updatedFiledName = field?.replace('_', '-');
    const ext = getFileExtension(fileName);

    return `${slugifyUserName}-${updatedFiledName}-${getTimestampInSeconds()}.${ext}`;
  };

  // action: viewDetails, downloadResume
  // fileFieldType: resume, cover_letter
  const getCustomerDetails = useCallback(
    async (userId, action, fileFieldType) => {
      try {
        const candidateDetails = await getCustomerFullDetails(userId).unwrap();

        if (candidateDetails?.candidate) {
          setFullCustomerDetails(candidateDetails?.candidate);
        }

        if (isInsufficientCreditError(candidateDetails?.message)) {
          setIsConfModalOpened(true);
          return false;
        }

        const isResumeFileType = fileFieldType === 'resume';

        if (!isResumeFileType) {
          return true;
        }

        const candidateAdditionalDetails = getParsedJson(
          candidateDetails?.candidate?.additional_fields,
        );

        const candidateName = candidateDetails?.candidate?.name;

        const resumeFileName = candidateAdditionalDetails?.resume;
        const resumeFileSize = candidateAdditionalDetails?.resume_size;

        const coverLetterFileName = candidateAdditionalDetails?.cover_letter;
        const coverLetterFileSize =
          candidateAdditionalDetails?.cover_letter_size;

        const currentFileName = isResumeFileType
          ? resumeFileName
          : coverLetterFileName;

        if (!currentFileName && isResumeFileType) {
          showError('Sorry, File not found!');
          return;
        }

        const currentFileSize = isResumeFileType
          ? resumeFileSize
          : coverLetterFileSize;

        if (action === 'downloadResume' && candidateDetails?.token) {
          const downloadUrl = `${Configs.API_URL}customers/download_document?field=${fileFieldType}&token=${candidateDetails?.token}`;

          fileSaver(
            downloadUrl,
            getDownloadFileName(currentFileName, candidateName, fileFieldType),
            setIsFileDownloading,
            authToken,
            setDownloadProgress,
            currentFileSize,
          );
        }

        return true;
      } catch (error) {
        console.log('error::', error);
        showError(error);
      }
    },
    [authToken, getCustomerFullDetails],
  );

  return [
    getCustomerDetails,
    {
      fullCustomerDetails,
      isLoading: isLoading || isFileDownloading,
      downloadProgress,
      alertModal: isConfModalOpened && (
        <ConfirmationModal
          isModalOpened={isConfModalOpened}
          setIsModalOpened={setIsConfModalOpened}
          title="Not enough credit!"
          description="Do you want to buy some credits?"
          modalHeight={180}
          confirmHandler={() => {
            setIsConfModalOpened(false);
            dispatch(setCheckoutRedirectPath(route));
            navigation.navigate('Pricing');
          }}
          isLoading={false}
        />
      ),
    },
  ];
}
