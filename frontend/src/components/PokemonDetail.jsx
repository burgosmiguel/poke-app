import React from 'react';
import { usePokemonStore } from '../stores/pokemon';
import { useFavoritesStore } from '../stores/favorites';

const TYPE_COLORS = {
  fire: ['#f08030', '#fff'],     water: ['#6890f0', '#fff'],
  grass: ['#78c850', '#fff'],    electric: ['#f8d030', '#333'],
  psychic: ['#f85888', '#fff'],  ice: ['#98d8d8', '#333'],
  dragon: ['#7038f8', '#fff'],   dark: ['#705848', '#fff'],
  fairy: ['#ee99ac', '#fff'],    normal: ['#a8a878', '#fff'],
  fighting: ['#c03028', '#fff'], flying: ['#a890f0', '#fff'],
  poison: ['#a040a0', '#fff'],   ground: ['#e0c068', '#333'],
  rock: ['#b8a038', '#fff'],     bug: ['#a8b820', '#fff'],
  ghost: ['#705898', '#fff'],    steel: ['#b8b8d0', '#333'],
};

export default function PokemonDetail({ onClose, onToggleFavorite }) {
  const pokemon = usePokemonStore((s) => s.selectedPokemon);
  const detailLoading = usePokemonStore((s) => s.detailLoading);
  const isFav = useFavoritesStore((s) =>
    pokemon ? s.items.some((f) => f.pokemon_id === pokemon.id) : false
  );

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal__close" onClick={onClose}>✕</button>

        {detailLoading && <div className="modal__loading">Loading...</div>}

        {!detailLoading && pokemon && (
          <>
            <div className="modal__header">
              <img src={pokemon.image} alt={pokemon.name} className="modal__image" />
              <div className="modal__meta">
                <span className="modal__id">#{String(pokemon.id).padStart(3, '0')}</span>
                <h2 className="modal__name">{pokemon.name}</h2>
                <div className="modal__types">
                  {pokemon.types.map((type) => {
                    const [bg, color] = TYPE_COLORS[type] || ['#888', '#fff'];
                    return (
                      <span key={type} className="type-badge" style={{ background: bg, color }}>
                        {type}
                      </span>
                    );
                  })}
                </div>
                <p className="modal__dims">
                  Height: {(pokemon.height / 10).toFixed(1)}m &nbsp;|&nbsp;
                  Weight: {(pokemon.weight / 10).toFixed(1)}kg
                </p>
              </div>
            </div>

            <div className="modal__stats">
              <h3>Base Stats</h3>
              {pokemon.stats.map((stat) => (
                <div key={stat.name} className="stat">
                  <span className="stat__name">{stat.name}</span>
                  <div className="stat__bar">
                    <div
                      className="stat__fill"
                      style={{ width: `${Math.min(100, (stat.value / 255) * 100)}%` }}
                    />
                  </div>
                  <span className="stat__value">{stat.value}</span>
                </div>
              ))}
            </div>

            <button
              className={`modal__fav-btn${isFav ? ' modal__fav-btn--active' : ''}`}
              onClick={() => onToggleFavorite(pokemon)}
            >
              {isFav ? '★ Remove from Favorites' : '☆ Add to Favorites'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
