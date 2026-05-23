const service = require('../services/favoritesService');

function getUsername(req) {
  const raw = req.headers['x-username'];
  return (typeof raw === 'string' && raw.trim()) ? raw.trim().slice(0, 50) : 'trainer';
}

function getSocketId(req) {
  return req.headers['x-socket-id'] || null;
}

async function list(req, res, next) {
  try {
    const favorites = await service.getFavorites(getUsername(req));
    res.json(favorites);
  } catch (err) {
    next(err);
  }
}

async function add(req, res, next) {
  try {
    const username = getUsername(req);
    const favorite = await service.addFavorite(username, req.body);

    const initiatorId = getSocketId(req);
    req.io.emit('favorite:added', { initiatorId, username, favorite });
    console.log(`[Socket] Emitting favorite:added — ${favorite.pokemon_name} (user: ${username})`);

    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
}

async function updateNote(req, res, next) {
  try {
    const username = getUsername(req);
    const pokemonId = parseInt(req.params.pokemonId, 10);

    if (isNaN(pokemonId)) {
      return res.status(400).json({ error: 'pokemonId must be a number' });
    }

    const updated = await service.updateNote(username, pokemonId, req.body.note);

    const initiatorId = getSocketId(req);
    req.io.emit('favorite:updated', { initiatorId, username, favorite: updated });
    console.log(`[Socket] Emitting favorite:updated — ${updated.pokemon_name} (user: ${username})`);

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const username = getUsername(req);
    const pokemonId = parseInt(req.params.pokemonId, 10);

    if (isNaN(pokemonId)) {
      return res.status(400).json({ error: 'pokemonId must be a number' });
    }

    const removed = await service.removeFavorite(username, pokemonId);

    const initiatorId = getSocketId(req);
    req.io.emit('favorite:removed', {
      initiatorId,
      username,
      pokemonId,
      pokemonName: removed.pokemon_name,
    });
    console.log(`[Socket] Emitting favorite:removed — ${removed.pokemon_name} (user: ${username})`);

    res.json({ message: 'Favorite removed', favorite: removed });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, add, updateNote, remove };
