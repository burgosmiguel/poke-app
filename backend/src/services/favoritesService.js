const repository = require('../repositories/favoritesRepository');

function clientError(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

async function getFavorites(username) {
  return repository.findAll(username);
}

async function addFavorite(username, data) {
  const { pokemon_id, pokemon_name } = data;

  if (!pokemon_id || !pokemon_name) {
    throw clientError('pokemon_id and pokemon_name are required');
  }
  if (!Number.isInteger(pokemon_id) || pokemon_id < 1) {
    throw clientError('pokemon_id must be a positive integer');
  }
  if (typeof pokemon_name !== 'string' || pokemon_name.length > 100) {
    throw clientError('pokemon_name must be a string of 100 characters or less');
  }

  const existing = await repository.findByPokemonId(username, pokemon_id);
  if (existing) {
    throw clientError('Pokemon is already in favorites', 409);
  }

  return repository.create(username, data);
}

async function updateNote(username, pokemonId, note) {
  if (note !== undefined && typeof note !== 'string') {
    throw clientError('note must be a string');
  }
  if (note && note.length > 500) {
    throw clientError('note must be 500 characters or less');
  }

  const updated = await repository.updateNote(username, pokemonId, note ?? '');
  if (!updated) {
    throw clientError('Favorite not found', 404);
  }
  return updated;
}

async function removeFavorite(username, pokemonId) {
  const removed = await repository.remove(username, pokemonId);
  if (!removed) {
    throw clientError('Favorite not found', 404);
  }
  return removed;
}

module.exports = { getFavorites, addFavorite, updateNote, removeFavorite };
