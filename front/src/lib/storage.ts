export const getLocalStorageItem = <T>(key: string): T | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorageItem = (key: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(key);
};
