import { io } from 'socket.io-client';
import { useFavoritesStore } from '../stores/favorites';
import { useToastStore } from '../stores/toast';

const socketUrl = import.meta.env.VITE_SOCKET_URL || '';
let socket = null;

export function getSocket() {
  return socket;
}

export function setupSocket() {
  socket = io(socketUrl);

  socket.on('connect', () => console.log('[Socket] Connected:', socket.id));
  socket.on('disconnect', () => console.log('[Socket] Disconnected'));

  function isCurrentUser(username) {
    return username === (localStorage.getItem('username'));
  }

  // initiatorId is the socket.id of the tab that triggered the action.
  // We skip applying the update to that tab (it already updated optimistically),
  // but every OTHER tab — even if it has the same username — will process it.
  socket.on('favorite:added', ({ initiatorId, username, favorite }) => {
    if (initiatorId === socket.id) return;
    if (isCurrentUser(username)) {
      useFavoritesStore.getState().addFavoriteFromSocket(favorite);
      useToastStore.getState().add(`${username} added ${favorite.pokemon_name} to favorites!`);
    }
  });

  socket.on('favorite:removed', ({ initiatorId, username, pokemonId, pokemonName }) => {
    if (initiatorId === socket.id) return;
    if (isCurrentUser(username)) {
      useFavoritesStore.getState().removeFavoriteFromSocket(pokemonId);
      useToastStore.getState().add(`${username} removed ${pokemonName} from favorites`);
    }
  });

  socket.on('favorite:updated', ({ initiatorId, username, favorite }) => {
    if (initiatorId === socket.id) return;
    if (isCurrentUser(username)) {
      useFavoritesStore.getState().updateFavoriteFromSocket(favorite);
      useToastStore.getState().add(`${username} updated note for ${favorite.pokemon_name}`);
    }
  });
}
