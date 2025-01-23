import { useMutation } from 'react-query';
import { uploadFile, UploadFileResponse } from '../../services/fileService';

const useUploadFile = () => {
  return useMutation<UploadFileResponse, any, File>(uploadFile, {
    onSuccess: (data: UploadFileResponse) => {
      console.log('File uploaded successfully', data);
    },
    onError: (error) => {
      console.error('File upload failed', error);
    },
  });
};

export { useUploadFile };
