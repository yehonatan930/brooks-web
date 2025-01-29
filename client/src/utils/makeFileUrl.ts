export const makeFileUrl = (filePath: string) => {
  return process.env.REACT_APP_API_URL + filePath;
};
