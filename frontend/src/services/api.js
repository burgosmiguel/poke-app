import axios from 'axios';
import { getSocket } from './socket';

const apiUrl = import.meta.env.VITE_API_URL || '';

const api = axios.create({ baseURL: `${apiUrl}/api` });

api.interceptors.request.use((config) => {
  config.headers['X-Username'] = localStorage.getItem('username') || 'trainer';
  const socketId = getSocket()?.id;
  if (socketId) config.headers['X-Socket-Id'] = socketId;
  return config;
});

export const pokemonApi = {
  list: (limit = 20, offset = 0) =>
    axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`),
  detail: (nameOrId) =>
    axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`),
};

export const favoritesApi = {
  list: () => api.get('/favorites'),
  add: (data) => api.post('/favorites', data),
  updateNote: (pokemonId, note) => api.patch(`/favorites/${pokemonId}/note`, { note }),
  remove: (pokemonId) => api.delete(`/favorites/${pokemonId}`),
};
