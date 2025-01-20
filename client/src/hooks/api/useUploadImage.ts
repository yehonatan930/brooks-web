import { useMutation } from 'react-query';
import { uploadFile, UploadFileResponse } from '../../services/fileService';

const useUploadImage = () => {
  return useMutation<UploadFileResponse, any, File>(uploadFile, {
    onSuccess: (data: UploadFileResponse) => {
      console.log('Image uploaded successfully', data);
    },
    onError: (error) => {
      console.error('Image upload failed', error);
    },
  });
};

export { useUploadImage };
