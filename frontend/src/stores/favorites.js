import { create } from 'zustand';
import { favoritesApi } from '../services/api';

export const useFavoritesStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchFavorites: async () => {
    set({ loading: true });
    try {
      const { data } = await favoritesApi.list();
      set({ items: data });
    } catch (err) {
      console.error('[Favorites] Failed to fetch:', err);
    } finally {
      set({ loading: false });
    }
  },

  addFavorite: async (pokemonData) => {
    const { data } = await favoritesApi.add(pokemonData);
    set((state) => ({ items: [data, ...state.items] }));
    return data;
  },

  updateNote: async (pokemonId, note) => {
    const { data } = await favoritesApi.updateNote(pokemonId, note);
    set((state) => ({
      items: state.items.map((f) => (f.pokemon_id === pokemonId ? data : f)),
    }));
    return data;
  },

  removeFavorite: async (pokemonId) => {
    await favoritesApi.remove(pokemonId);
    set((state) => ({ items: state.items.filter((f) => f.pokemon_id !== pokemonId) }));
  },

  isFavorite: (pokemonId) => get().items.some((f) => f.pokemon_id === pokemonId),

  // Socket-driven mutations — no API call needed
  addFavoriteFromSocket: (favorite) => {
    set((state) => {
      if (state.items.some((f) => f.pokemon_id === favorite.pokemon_id)) return {};
      return { items: [favorite, ...state.items] };
    });
  },

  removeFavoriteFromSocket: (pokemonId) => {
    set((state) => ({ items: state.items.filter((f) => f.pokemon_id !== pokemonId) }));
  },

  updateFavoriteFromSocket: (favorite) => {
    set((state) => ({
      items: state.items.map((f) => (f.pokemon_id === favorite.pokemon_id ? favorite : f)),
    }));
  },
}));
