import { useState, useEffect } from 'react';

function getStorageValue<D>(key: string, defaultValue?: D): D | undefined {
  // getting stored value
  const saved = localStorage.getItem(key);
  const initial = saved ? JSON.parse(saved) : null;
  return initial || defaultValue;
}

export const useLocalStorage = <T>(
  key: string,
  defaultValue?: T
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>] => {
  const [value, setValue] = useState<T | undefined>(() => {
    return getStorageValue<T>(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
