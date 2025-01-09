import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  IconButton,
  styled,
  TextField,
  Tooltip,
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import './CreatePostScreen.scss';

interface CreatePostScreenProps {}

const schema = yup.object().shape({
  bookTitle: yup.string().required('book title is required'),
  content: yup.string(),
  imageUrl: yup.string(),
});

export interface PostFormData {
  bookTitle: string;
  content: string;
  imageUrl: string;
}

const CreatePostScreen: FunctionComponent<CreatePostScreenProps> = (props) => {
  const [postData, setPostData] = useState<PostFormData>({
    bookTitle: '',
    content: '',
    imageUrl: '',
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const onChangeInFormData = (e: any) => {
    console.log(e.target.name, e.target.value);
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const fetchBookCover = useCallback(
    async (bookTitle: string) => {
      // const response = await fetch(
      //   `https://www.googleapis.com/books/v1/volumes?q=${bookTitle}`
      // );
      // const data = await response.json();
      // if (data.items && data.items.length > 0) {
      //   const imageUrl = data.items[0].volumeInfo.imageLinks.thumbnail;
      //   setPostData({ ...postData, imageUrl });
      // }

      // This is a dummy implementation
      setPostData({
        ...postData,
        imageUrl: 'https://cdn.candycode.com/jotai/jotai-mascot.png',
      });
    },
    [postData]
  );

  useEffect(() => {
    if (postData.bookTitle) {
      fetchBookCover(postData.bookTitle);
    }
  }, [fetchBookCover, postData.bookTitle]);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <div className="pretty-card">
      <form className="registration-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="title">New Post</h2>
        <Tooltip title="Enter your book title" arrow>
          <Controller
            name="bookTitle"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                className="input-field"
                type="text"
                placeholder="Your Book title"
                margin={'normal'}
                error={!!errors.bookTitle}
                helperText={errors.bookTitle ? errors.bookTitle.message : ''}
                InputProps={{
                  startAdornment: <BookIcon />,
                }}
                value={postData.bookTitle}
                onChange={onChangeInFormData}
              />
            )}
          />
        </Tooltip>
        <Tooltip title="What do you have to say?" arrow>
          <Controller
            name="content"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                margin={'normal'}
                {...field}
                className="input-field"
                type="text"
                placeholder="Your thoughts"
                error={!!errors.content}
                helperText={errors.content ? errors.content.message : ''}
                InputProps={{
                  startAdornment: <LightbulbIcon />,
                }}
                value={postData.content}
                onChange={onChangeInFormData}
              />
            )}
          />
        </Tooltip>
        {postData.imageUrl && (
          <div className="CreatePostScreen__image-preview-container">
            <Button
              className="CreatePostScreen__image-preview-change"
              component="label"
              variant="contained"
              startIcon={<PhotoCameraBackIcon />}
            >
              change image
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                // multiple
              />
            </Button>
            <img
              src={postData.imageUrl}
              alt="preview"
              className="CreatePostScreen__image-preview"
            />
          </div>
        )}
        <span>
          <Button
            disabled={!isValid}
            type="submit"
            variant="contained"
            className="button"
          >
            Publish
          </Button>
        </span>
      </form>
    </div>
  );
};

export default CreatePostScreen;
