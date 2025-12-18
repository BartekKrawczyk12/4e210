const { ObjectId } = require('mongodb');
const { getDB } = require('../data/connection');

async function getAllGames(dealer, sortField = 'createdAt', sortOrder = 1) {
    const db = getDB();

    const filter = {};

    if (dealer) {
        filter.dealerName = { $regex: dealer, $options: 'i' };
    }

    return await db.collection('blackjack_games')
        .find(filter)
        .sort({ [sortField]: sortOrder })
        .toArray();
}


async function getGameById(id) {
    const db = getDB();
    return await db.collection('blackjack_games')
        .findOne({ _id: new ObjectId(id) });
}

async function getLatestGame() {
    const db = getDB();
    return await db.collection('blackjack_games')
        .find().sort({ createdAt: -1 }).limit(1).next();
}

async function addGame(game) {
    const db = getDB();
    await db.collection('blackjack_games').insertOne(game);
}

async function updateGame(id, update) {
    const db = getDB();
    await db.collection('blackjack_games').updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
    );
}

async function deleteGame(id) {
    const db = getDB();
    await db.collection('blackjack_games')
        .deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
    getAllGames,
    getGameById,
    getLatestGame,
    addGame,
    updateGame,
    deleteGame
};
