const db = require('./db');

const CARD_IMAGES = `SELECT id, image_url FROM Cards`;
const CARD_ID = `SELECT id FROM Cards`;

module.exports = {
  cardImages: () => db.any(CARD_IMAGES),
  cardId: () => db.any(CARD_ID)
}