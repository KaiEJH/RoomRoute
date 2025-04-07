// utils/recentRoutes.js
const STORAGE_KEY = 'recentRoutes';

export const saveRecentRoute = (route) => {
  const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];

  const newRoute = {
    ...route,
    id: `${route.start}→${route.end}`,
    timestamp: Date.now(),
  };

  const filtered = stored.filter(r => r.id !== newRoute.id);
  const updated = [newRoute, ...filtered].slice(0, 10); // keep 10 most recent

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getRecentRoutes = () => {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
};

export const clearRecentRoutes = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};
