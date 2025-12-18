const express = require('express');
const router = express.Router();
const blackjackController = require('../controllers/blackjackController');

router.get('/', blackjackController.getAll);
router.get('/new', blackjackController.getNewGameForm);
router.post('/new', blackjackController.postNewGame);

router.get('/dealer/:id', blackjackController.getDealerForm);
router.post('/dealer/:id', blackjackController.postDealerEdit);

router.post('/remove/:id', blackjackController.deleteGame);
router.get('/current', blackjackController.getCurrentGame);
router.post('/current/hit', blackjackController.postPlayerHit);
router.post('/current/stand', blackjackController.postPlayerStand);

router.get('/rules', (req, res) => {
    res.render('pages/rules');
});


module.exports = router;
