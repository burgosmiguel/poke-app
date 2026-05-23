import React from 'react';

export default function PokemonCard({ pokemon, isFav, onClick, onToggleFavorite }) {
  return (
    <div className="card" onClick={onClick}>
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
        alt={pokemon.name}
        className="card__image"
        loading="lazy"
      />
      <div className="card__body">
        <span className="card__id">#{String(pokemon.id).padStart(3, '0')}</span>
        <h3 className="card__name">{pokemon.name}</h3>
      </div>
      <button
        className={`card__fav-btn${isFav ? ' card__fav-btn--active' : ''}`}
        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
      >
        {isFav ? '★' : '☆'}
      </button>
    </div>
  );
}
