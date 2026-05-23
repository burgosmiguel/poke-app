import React, { useState, useEffect } from 'react';
import { usePokemonStore } from '../stores/pokemon';
import { useFavoritesStore } from '../stores/favorites';
import { useToastStore } from '../stores/toast';
import PokemonCard from '../components/PokemonCard';
import PokemonDetail from '../components/PokemonDetail';

export default function PokemonView() {
  const { list, loading, currentPage, total, pageSize, fetchList, fetchDetail, clearSelected, goToPage } =
    usePokemonStore();
  const { fetchFavorites, addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const favoriteItems = useFavoritesStore((s) => s.items);
  const addToast = useToastStore((s) => s.add);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalPages = Math.ceil(total / pageSize) || 1;

  useEffect(() => {
    fetchList();
    fetchFavorites();
  }, []);

  async function openDetail(nameOrId) {
    setIsModalOpen(true);
    await fetchDetail(nameOrId);
  }

  function closeModal() {
    setIsModalOpen(false);
    clearSelected();
  }

  async function addToFavorites(pokemon) {
    await addFavorite({
      pokemon_id: pokemon.id,
      pokemon_name: pokemon.name,
      pokemon_image: pokemon.image,
      pokemon_types: pokemon.types || [],
    });
    addToast(`${pokemon.name} added to favorites!`, 'success');
  }

  async function toggleFavorite(pokemon) {
    if (isFavorite(pokemon.id)) {
      await removeFavorite(pokemon.id);
      addToast(`${pokemon.name} removed from favorites`, 'info');
    } else {
      await addToFavorites(pokemon);
    }
  }

  // Card star icon: fetches detail first to capture types, skips opening the modal
  async function quickToggle(pokemon) {
    if (isFavorite(pokemon.id)) {
      await removeFavorite(pokemon.id);
      addToast(`${pokemon.name} removed from favorites`, 'info');
      return;
    }
    await fetchDetail(pokemon.name);
    const detail = usePokemonStore.getState().selectedPokemon;
    if (!detail) return;
    await addToFavorites(detail);
    clearSelected();
  }

  async function searchPokemon() {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    await openDetail(q);
  }

  const favIds = new Set(favoriteItems.map((f) => f.pokemon_id));

  return (
    <div className="pokemon-view">
      <div className="search-bar">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchPokemon()}
          placeholder="Search by name or ID..."
          className="search-input"
        />
        <button className="btn btn--primary" onClick={searchPokemon}>Search</button>
      </div>

      {loading ? (
        <div className="loading">Loading Pokémon...</div>
      ) : (
        <div className="pokemon-grid">
          {list.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isFav={favIds.has(pokemon.id)}
              onClick={() => openDetail(pokemon.name)}
              onToggleFavorite={() => quickToggle(pokemon)}
            />
          ))}
        </div>
      )}

      <div className="pagination">
        <button className="btn" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
          ← Prev
        </button>
        <span className="pagination__info">Page {currentPage} of {totalPages}</span>
        <button className="btn" disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)}>
          Next →
        </button>
      </div>

      {isModalOpen && <PokemonDetail onClose={closeModal} onToggleFavorite={toggleFavorite} />}
    </div>
  );
}
