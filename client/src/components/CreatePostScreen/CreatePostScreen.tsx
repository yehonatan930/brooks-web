import { FunctionComponent, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import './CreatePostScreen.scss';
import { BookVolumeInfo, NewPostFormData } from '../../types/post';
import { useCreatePost } from '../../hooks/api/useCreatePost';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAtomValue } from 'jotai';
import { loggedInUserAtom } from '../../context/LoggedInUserAtom';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import debounce from 'lodash/debounce';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const fetchBookCover = debounce(
  async (
    bookTitle: string,
    authorName?: string
  ): Promise<string | undefined> => {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${bookTitle}` +
        (authorName ? `+inauthor:${authorName}` : '')
    );
    const data: { items: { volumeInfo: BookVolumeInfo }[] } =
      await response.json();
    const bookInfos: BookVolumeInfo[] = data?.items
      ? data.items.map((item: any) => item.volumeInfo)
      : [];

    console.log('bookInfos', bookInfos);
    if (bookInfos.length > 0) {
      const imageUrl = bookInfos[0]?.imageLinks?.thumbnail;

      return imageUrl;
    }
  },
  300
);

interface CreatePostScreenProps {
  edit?: boolean;
}
const DEFAULT_IMAGE_URL: string =
  'https://cdn.candycode.com/jotai/jotai-mascot.png';

const schema = yup.object().shape({
  bookTitle: yup.string().required('book title is required'),
  content: yup.string(),
  imageUrl: yup.string(),
  readingProgress: yup.string(),
  authorName: yup.string(),
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
    defaultValues: {
      imageUrl: DEFAULT_IMAGE_URL,
    },
  });

  const onSubmit = (data: NewPostFormData) => {
    createPost({ userId: user._id, ...data });
  };

  useEffect(() => {
    const fetchCover = async () => {
      if (bookTitle) {
        console.log('fetching book cover for:', bookTitle, authorName);
        const imageUrl = await fetchBookCover(bookTitle, authorName);
        console.log('Fetched image URL:', imageUrl);

        setValue('imageUrl', imageUrl || DEFAULT_IMAGE_URL, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    };

    fetchCover();
  }, [bookTitle, authorName, setValue]);

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
              onChange={(e) => {
                field.onChange(e);
                handleBookTitleChange(e);
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
        <Controller
          name="readingProgress"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              margin={'normal'}
              {...field}
              className="input-field"
              type="text"
              placeholder="Your progress (e.g. 50 pages)"
              error={!!errors.readingProgress}
              helperText={
                errors.readingProgress ? errors.readingProgress.message : ''
              }
              slotProps={{
                input: {
                  startAdornment: <MenuBookIcon />,
                },
              }}
            />
          )}
        />
        <Controller
          name="authorName"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              margin={'normal'}
              {...field}
              placeholder="Author name"
              className="input-field"
              type="text"
              error={!!errors.authorName}
              helperText={errors.authorName ? errors.authorName.message : ''}
              slotProps={{
                input: {
                  startAdornment: <PersonIcon />,
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
