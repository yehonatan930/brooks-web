import { useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useFormContext } from 'react-hook-form';
import stringSimilarity from 'string-similarity';
import { BookVolumeInfo } from '../types/post';

const DEFAULT_IMAGE_URL: string = 'https://cdn.candycode.com/jotai/jotai-mascot.png';

const findBestMatch = (bookInfos: BookVolumeInfo[], bookTitle: string) => {
  return bookInfos.reduce((bestMatch, bookInfo) => {
    const similarity = stringSimilarity.compareTwoStrings(bookInfo.title.toLowerCase(), bookTitle.toLowerCase());
    return similarity > bestMatch.highestSimilarity
      ? { highestSimilarity: similarity, bestMatch: bookInfo }
      : bestMatch;
  }, { highestSimilarity: 0, bestMatch: {} as BookVolumeInfo }).bestMatch;
};

export const useFetchBookCover = () => {
  const { setValue } = useFormContext();

  const debouncedFetch = debounce(async (bookTitle: string) => {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${bookTitle}`
    );
    const data: { items: { volumeInfo: BookVolumeInfo }[] } = await response.json();
    const bookInfos = data ? data.items.map((item: any) => item.volumeInfo) : [];

    if (bookInfos.length > 0) {
      const imageUrl = findBestMatch(bookInfos, bookTitle)?.imageLinks?.thumbnail;
      setValue('imageUrl', imageUrl);
    } else {
      setValue('imageUrl', DEFAULT_IMAGE_URL);
    }
  }, 300);

  return useCallback((bookTitle: string) => {
    debouncedFetch(bookTitle);
  }, [debouncedFetch]);
};