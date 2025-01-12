import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import './CreatePostScreen.scss';
import { NewPostFormData } from '../../types/post';
import { useCreatePost } from '../../hooks/useCreatePost';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAtomValue } from 'jotai';
import { loggedInUserAtom } from '../../context/LoggedInUserAtom';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';

interface CreatePostScreenProps {}

const schema = yup.object().shape({
  bookTitle: yup.string().required('book title is required'),
  content: yup.string(),
  imageUrl: yup.string(),
});

const CreatePostScreen: FunctionComponent<CreatePostScreenProps> = (props) => {
  const user = useAtomValue(loggedInUserAtom);

  const { isLoading, mutate: createPost } = useCreatePost();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<NewPostFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const watchBookTitle = watch('bookTitle');

  const onSubmit = (data: NewPostFormData) => {
    console.log(data);
    createPost({ userId: user._id, ...data });
  };

  const findBestMatch = (bookTitles: [string], bookTitle: string) => {
    let bestMatch = null;
    let highestSimilarity = 0;

    bookTitles.forEach((title) => {
      const similarity = stringSimilarity.compareTwoStrings(title.toLowerCase(), bookTitle.toLowerCase());
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = title;
      }
    });

    return bestMatch;
  }

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
      setValue('imageUrl', 'https://cdn.candycode.com/jotai/jotai-mascot.png');
    },
    [setValue]
  );

  useEffect(() => {
    if (watchBookTitle) {
      fetchBookCover(watchBookTitle);
    } else {
      setValue('imageUrl', '');
    }
  }, [fetchBookCover, setValue, watchBookTitle]);

  return (
    <div className="pretty-card CreatePostScreen">
      <form
        className="CreatePostScreen__form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="title">New Post</h2>
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
              slotProps={{
                input: {
                  startAdornment: <BookIcon />,
                },
              }}
            />
          )}
        />
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
              slotProps={{
                input: {
                  startAdornment: <LightbulbIcon />,
                },
              }}
            />
          )}
        />
        <Controller
          name="imageUrl"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              margin={'normal'}
              {...field}
              className="input-field"
              type="text"
              placeholder="your image url"
              error={!!errors.imageUrl}
              helperText={errors.imageUrl ? errors.imageUrl.message : ''}
              slotProps={{
                input: {
                  startAdornment: <PhotoCameraBackIcon />,
                },
              }}
            />
          )}
        />
        <span>
          <LoadingButton
            disabled={!isValid}
            type="submit"
            variant="contained"
            className="button"
            loading={isLoading}
          >
            Publish
          </LoadingButton>
        </span>
      </form>
      <div className="CreatePostScreen__image-preview-container">
        {watch('imageUrl') && (
          <img
            src={watch('imageUrl')}
            alt="preview"
            className="CreatePostScreen__image-preview"
          />
        )}
      </div>
    </div>
  );
};

export default CreatePostScreen;
