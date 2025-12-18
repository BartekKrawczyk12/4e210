const blackjackModel = require('../models/blackjackModel');
const { createDeck } = require('../utils/deck');
const { simpleHash } = require('../utils/hash');

function drawCard(deck) {
    return deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
}

function calculateSum(hand) {
    let sum = hand.reduce((acc, c) => acc + c.value, 0);
    let aces = hand.filter(c => c.card.startsWith('A')).length;

    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces--;
    }
    return sum;
}

async function getAll(req, res, next) {
    try {
        const { dealer, sort, order } = req.query;
        const allowedSorts = ['createdAt', 'playerSum', 'dealerSum'];
        const sortField = allowedSorts.includes(sort) ? sort : 'createdAt';
        const sortOrder = order === 'desc' ? -1 : 1;

        const games = await blackjackModel.getAllGames(
            dealer,
            sortField,
            sortOrder
        );

        res.render('pages/index', { games, query: req.query });
    } catch (err) {
        next(err);
    }
}

function getNewGameForm(req, res) {
    res.render('pages/add');
}

async function postNewGame(req, res, next) {
    try {
        const { dealer, password } = req.body;

        if (!dealer || dealer.trim().length < 3) {
            return res.status(400).render('pages/error/error', {
                status: 400,
                message: 'Nazwa krupiera musi mieć co najmniej 3 znaki'
            });
        }

        if (!password || password.trim().length === 0) {
            return res.status(400).render('pages/error/error', {
                status: 400,
                message: 'Hasło jest wymagane do utworzenia gry'
            });
        }

        const deck = createDeck();
        const player = [drawCard(deck), drawCard(deck)];
        const dealerHand = [drawCard(deck), drawCard(deck)];

        const game = {
            player,
            dealer: dealerHand,
            deck,
            playerSum: calculateSum(player),
            dealerSum: calculateSum(dealerHand),
            dealerName: dealer.trim(),
            passwordHash: simpleHash(password.trim()),
            createdAt: new Date()
        };

        await blackjackModel.addGame(game);
        res.redirect('/current');
    } catch (err) {
        next(err);
    }
}

async function getDealerForm(req, res, next) {
    try {
        const game = await blackjackModel.getGameById(req.params.id);
        if (!game) {
            return res.status(404).render('pages/error/error', {
                status: 404,
                message: 'Nie znaleziono gry'
            });
        }
        res.render('pages/edit', { game });
    } catch (err) {
        next(err);
    }
}

async function postDealerEdit(req, res, next) {
    try {
        const { dealer, password } = req.body;

        if (!dealer || dealer.trim().length < 3) {
            return res.status(400).render('pages/error/error', {
                status: 400,
                message: 'Nazwa krupiera musi mieć co najmniej 3 znaki'
            });
        }

        if (!password || password.trim().length === 0) {
            return res.status(400).render('pages/error/error', {
                status: 400,
                message: 'Hasło jest wymagane do zmiany nazwy krupiera'
            });
        }

        const game = await blackjackModel.getGameById(req.params.id);
        if (!game) {
            return res.status(404).render('pages/error/error', {
                status: 404,
                message: 'Nie znaleziono gry'
            });
        }

        const hashedInput = simpleHash(password.trim());
        if (game.passwordHash && game.passwordHash !== hashedInput) {
            return res.status(403).render('pages/error/error', {
                status: 403,
                message: 'Nieprawidłowe hasło'
            });
        }

        await blackjackModel.updateGame(req.params.id, {
            dealerName: dealer.trim()
        });

        res.redirect('/');
    } catch (err) {
        next(err);
    }
}

async function deleteGame(req, res, next) {
    try {
        await blackjackModel.deleteGame(req.params.id);
        res.redirect('/');
    } catch (err) {
        next(err);
    }
}

async function getCurrentGame(req, res, next) {
    try {
        const game = await blackjackModel.getLatestGame();
        res.render('pages/current', { game });
    } catch (err) {
        next(err);
    }
}

async function postPlayerHit(req, res, next) {
    try {
        const game = await blackjackModel.getLatestGame();
        if (!game || game.finished) return res.redirect('/current');

        const deck = game.deck || [];
        if (!deck.length) return res.redirect('/current');

        const player = game.player || [];
        const card = drawCard(deck);
        player.push(card);

        const playerSum = calculateSum(player);

        let finished = false;
        let result = null;

        if (playerSum > 21) {
            finished = true;
            result = "player bust";
        }

        await blackjackModel.updateGame(game._id, { player, playerSum, deck, finished, result });
        res.redirect('/current');
    } catch (err) {
        next(err);
    }
}

async function postPlayerStand(req, res, next) {
    try {
        const game = await blackjackModel.getLatestGame();
        if (!game || game.finished) return res.redirect('/current');

        const deck = game.deck || [];
        const dealer = game.dealer || [];
        let dealerSum = calculateSum(dealer);

        while (dealerSum <= 16 && deck.length > 0) {
            const card = drawCard(deck);
            dealer.push(card);
            dealerSum = calculateSum(dealer);
        }

        let finished = true;
        let result = null;
        const playerSum = game.playerSum;

        if (dealerSum > 21) {
            result = "dealer bust";
        } else if (playerSum > dealerSum) {
            result = "player wins";
        } else if (dealerSum > playerSum) {
            result = "dealer wins";
        } else {
            result = "draw";
        }

        await blackjackModel.updateGame(game._id, { dealer, dealerSum, deck, finished, result });
        res.redirect('/current');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAll,
    getNewGameForm,
    postNewGame,
    getDealerForm,
    postDealerEdit,
    deleteGame,
    getCurrentGame,
    postPlayerHit,
    postPlayerStand
};
