import React, { useState } from 'react';

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

export default function FavoriteItem({ item, onUpdateNote, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  function startEdit() {
    setNoteInput(item.note || '');
    setEditing(true);
  }

  function saveNote() {
    onUpdateNote(noteInput);
    setEditing(false);
  }

  return (
    <div className="fav-item">
      <img
        src={
          item.pokemon_image ||
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.pokemon_id}.png`
        }
        alt={item.pokemon_name}
        className="fav-item__image"
      />
      <div className="fav-item__body">
        <div className="fav-item__header">
          <span className="fav-item__id">#{String(item.pokemon_id).padStart(3, '0')}</span>
          <h3 className="fav-item__name">{item.pokemon_name}</h3>
          {item.pokemon_types?.length > 0 && (
            <div className="fav-item__types">
              {item.pokemon_types.map((type) => {
                const [bg, color] = TYPE_COLORS[type] || ['#888', '#fff'];
                return (
                  <span
                    key={type}
                    className="type-badge"
                    style={{ background: bg, color, fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                  >
                    {type}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="fav-item__note">
          {editing ? (
            <>
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="fav-item__note-input"
                placeholder="Add a personal note..."
                rows={2}
                onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
                autoFocus
              />
              <div className="fav-item__note-actions">
                <button className="btn btn--primary" onClick={saveNote}>Save</button>
                <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <p className="fav-item__note-text" onClick={startEdit}>
              {item.note || '— No note yet. Click to add one.'}
            </p>
          )}
        </div>
      </div>

      <button className="fav-item__remove" title="Remove from favorites" onClick={onRemove}>
        ✕
      </button>
    </div>
  );
}
