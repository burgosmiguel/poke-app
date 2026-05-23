import { create } from 'zustand';
import { pokemonApi } from '../services/api';

export const usePokemonStore = create((set, get) => ({
  list: [],
  total: 0,
  currentPage: 1,
  pageSize: 20,
  loading: false,
  selectedPokemon: null,
  detailLoading: false,

  fetchList: async () => {
    const { currentPage, pageSize } = get();
    const offset = (currentPage - 1) * pageSize;
    set({ loading: true });
    try {
      const { data } = await pokemonApi.list(pageSize, offset);
      set({
        total: data.count,
        list: data.results.map((p, i) => ({ name: p.name, id: offset + i + 1 })),
      });
    } catch (err) {
      console.error('[Pokemon] Failed to fetch list:', err);
    } finally {
      set({ loading: false });
    }
  },

  fetchDetail: async (nameOrId) => {
    set({ detailLoading: true, selectedPokemon: null });
    try {
      const { data } = await pokemonApi.detail(nameOrId);
      set({
        selectedPokemon: {
          id: data.id,
          name: data.name,
          image:
            data.sprites.other['official-artwork'].front_default ||
            data.sprites.front_default,
          types: data.types.map((t) => t.type.name),
          stats: data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
          height: data.height,
          weight: data.weight,
        },
      });
    } catch (err) {
      console.error('[Pokemon] Failed to fetch detail:', err);
    } finally {
      set({ detailLoading: false });
    }
  },

  clearSelected: () => set({ selectedPokemon: null, detailLoading: false }),

  goToPage: async (page) => {
    set({ currentPage: page });
    await get().fetchList();
  },
}));
