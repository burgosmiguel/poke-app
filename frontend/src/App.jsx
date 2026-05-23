import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import PokemonView from './views/PokemonView';
import FavoritesView from './views/FavoritesView';
import ToastContainer from './components/ToastContainer';
import { useFavoritesStore } from './stores/favorites';

export default function App() {
  const [username, setUsername] = useState(
    () => localStorage.getItem('username') || 'trainer'
  );
  const itemCount = useFavoritesStore((s) => s.items.length);

  function handleUsernameBlur(e) {
    const name = e.target.value.trim() || 'trainer';
    setUsername(name);
    localStorage.setItem('username', name);
  }

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <div className="header__brand">
            <span className="header__logo">⚡</span>
            <span className="header__title">PokeApp</span>
          </div>
          <nav className="header__nav">
            <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link--active' : '')}>
              Pokédex
            </NavLink>
            <NavLink to="/favorites" className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link--active' : '')}>
              Favorites
              {itemCount > 0 && <span className="nav-badge">{itemCount}</span>}
            </NavLink>
          </nav>
          <div className="header__user">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={handleUsernameBlur}
              placeholder="Trainer name"
              className="username-input"
              title="Your trainer name"
            />
          </div>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<PokemonView />} />
          <Route path="/favorites" element={<FavoritesView />} />
        </Routes>
      </main>

      <ToastContainer />
    </>
  );
}
