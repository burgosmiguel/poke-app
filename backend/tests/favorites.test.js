const service = require('../src/services/favoritesService');

jest.mock('../src/repositories/favoritesRepository', () => ({
  findAll: jest.fn(),
  findByPokemonId: jest.fn(),
  create: jest.fn(),
  updateNote: jest.fn(),
  remove: jest.fn(),
}));

const repo = require('../src/repositories/favoritesRepository');

beforeEach(() => jest.clearAllMocks());

describe('getFavorites', () => {
  it('returns all favorites for a user', async () => {
    const rows = [{ id: 1, pokemon_name: 'bulbasaur' }];
    repo.findAll.mockResolvedValue(rows);

    const result = await service.getFavorites('trainer');
    expect(result).toEqual(rows);
    expect(repo.findAll).toHaveBeenCalledWith('trainer');
  });
});

describe('addFavorite', () => {
  const validData = { pokemon_id: 1, pokemon_name: 'bulbasaur', pokemon_types: ['grass'] };

  it('creates a favorite when valid', async () => {
    repo.findByPokemonId.mockResolvedValue(null);
    repo.create.mockResolvedValue({ id: 1, ...validData, username: 'trainer' });

    const result = await service.addFavorite('trainer', validData);

    expect(result.pokemon_name).toBe('bulbasaur');
    expect(repo.create).toHaveBeenCalledWith('trainer', validData);
  });

  it('throws 400 when pokemon_id is missing', async () => {
    await expect(service.addFavorite('trainer', { pokemon_name: 'bulbasaur' }))
      .rejects.toMatchObject({ statusCode: 400 });
  });

  it('throws 400 when pokemon_id is not a positive integer', async () => {
    await expect(service.addFavorite('trainer', { pokemon_id: -1, pokemon_name: 'bulbasaur' }))
      .rejects.toMatchObject({ statusCode: 400 });
  });

  it('throws 409 when pokemon is already a favorite', async () => {
    repo.findByPokemonId.mockResolvedValue({ id: 1, pokemon_id: 1 });

    await expect(service.addFavorite('trainer', validData))
      .rejects.toMatchObject({ statusCode: 409 });
  });
});

describe('updateNote', () => {
  it('updates and returns the favorite', async () => {
    repo.updateNote.mockResolvedValue({ id: 1, pokemon_name: 'bulbasaur', note: 'cool' });

    const result = await service.updateNote('trainer', 1, 'cool');
    expect(result.note).toBe('cool');
  });

  it('throws 404 when favorite does not exist', async () => {
    repo.updateNote.mockResolvedValue(null);

    await expect(service.updateNote('trainer', 999, 'hi'))
      .rejects.toMatchObject({ statusCode: 404 });
  });

  it('throws 400 when note exceeds 500 characters', async () => {
    await expect(service.updateNote('trainer', 1, 'x'.repeat(501)))
      .rejects.toMatchObject({ statusCode: 400 });
  });
});

describe('removeFavorite', () => {
  it('removes and returns the favorite', async () => {
    repo.remove.mockResolvedValue({ id: 1, pokemon_name: 'bulbasaur' });

    const result = await service.removeFavorite('trainer', 1);
    expect(result.pokemon_name).toBe('bulbasaur');
  });

  it('throws 404 when favorite does not exist', async () => {
    repo.remove.mockResolvedValue(null);

    await expect(service.removeFavorite('trainer', 999))
      .rejects.toMatchObject({ statusCode: 404 });
  });
});
