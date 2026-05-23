const { Router } = require('express');
const controller = require('../controllers/favoritesController');

const router = Router();

router.get('/', controller.list);
router.post('/', controller.add);
router.patch('/:pokemonId/note', controller.updateNote);
router.delete('/:pokemonId', controller.remove);

module.exports = router;
