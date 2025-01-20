import axiosInstance from './axiosInstance';

export interface UploadFileResponse {
  url: string;
}

export const uploadFile = async (file: File): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post<UploadFileResponse>(
    '/files/upload',
    formData,
    {
      params: { file: file.name },
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return response.data;
};
