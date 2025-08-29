const express = require('express');
const { saveScore, getScores } = require('../controllers/scoreController');

const router = express.Router();

router.post('/', saveScore);
router.get('/', getScores);

module.exports = router;
