import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavoritesStore } from '../stores/favorites';
import { useToastStore } from '../stores/toast';
import FavoriteItem from '../components/FavoriteItem';

export default function FavoritesView() {
  const { items, loading, fetchFavorites, updateNote, removeFavorite } = useFavoritesStore();
  const addToast = useToastStore((s) => s.add);

  useEffect(() => { fetchFavorites(); }, []);

  async function handleUpdateNote(pokemonId, note) {
    try {
      await updateNote(pokemonId, note);
      addToast('Note updated!', 'success');
    } catch {
      addToast('Failed to update note', 'error');
    }
  }

  async function handleRemove(pokemonId, pokemonName) {
    try {
      await removeFavorite(pokemonId);
      addToast(`${pokemonName} removed from favorites`, 'info');
    } catch {
      addToast('Failed to remove favorite', 'error');
    }
  }

  return (
    <div className="favorites-view">
      <div className="favorites-view__header">
        <h2>My Favorites</h2>
        {items.length > 0 && <span className="count-badge">{items.length} pokémon</span>}
      </div>

      {loading ? (
        <div className="loading">Loading favorites...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p>No favorites yet. Go catch some Pokémon!</p>
          <Link to="/" className="btn btn--primary">Browse Pokédex</Link>
        </div>
      ) : (
        <div className="favorites-list">
          {items.map((item) => (
            <FavoriteItem
              key={item.id}
              item={item}
              onUpdateNote={(note) => handleUpdateNote(item.pokemon_id, note)}
              onRemove={() => handleRemove(item.pokemon_id, item.pokemon_name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
