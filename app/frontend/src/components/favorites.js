const STORAGE_KEY = 'favoriteRoutes';

export const saveFavorite = (route) => {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const id = `${route.start}→${route.end}`;

  // If already saved, don't add again
  if (stored.some(r => r.id === id)) return;

  const newFavorite = {
    ...route,
    id,
    timestamp: Date.now()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([newFavorite, ...stored]));
};

export const removeFavorite = (route) => {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const id = `${route.start}→${route.end}`;
  const updated = stored.filter(r => r.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const isFavorite = (route) => {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const id = `${route.start}→${route.end}`;
  return stored.some(r => r.id === id);
};

export const getFavorites = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};
