const { pool } = require('../config/database');

async function findAll(username) {
  const { rows } = await pool.query(
    'SELECT * FROM favorites WHERE username = $1 ORDER BY created_at DESC',
    [username]
  );
  return rows;
}

async function findByPokemonId(username, pokemonId) {
  const { rows } = await pool.query(
    'SELECT * FROM favorites WHERE username = $1 AND pokemon_id = $2',
    [username, pokemonId]
  );
  return rows[0] || null;
}

async function create(username, data) {
  const { pokemon_id, pokemon_name, pokemon_image, pokemon_types, note } = data;
  const { rows } = await pool.query(
    `INSERT INTO favorites (username, pokemon_id, pokemon_name, pokemon_image, pokemon_types, note)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [username, pokemon_id, pokemon_name, pokemon_image || null, pokemon_types || [], note || '']
  );
  return rows[0];
}

async function updateNote(username, pokemonId, note) {
  const { rows } = await pool.query(
    `UPDATE favorites
     SET note = $3, updated_at = NOW()
     WHERE username = $1 AND pokemon_id = $2
     RETURNING *`,
    [username, pokemonId, note]
  );
  return rows[0] || null;
}

async function remove(username, pokemonId) {
  const { rows } = await pool.query(
    'DELETE FROM favorites WHERE username = $1 AND pokemon_id = $2 RETURNING *',
    [username, pokemonId]
  );
  return rows[0] || null;
}

module.exports = { findAll, findByPokemonId, create, updateNote, remove };
