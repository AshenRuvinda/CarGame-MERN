const Score = require('../models/Score');

const saveScore = async (req, res) => {
  const { username, time } = req.body;
  try {
    const newScore = new Score({ username, time });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getScores = async (req, res) => {
  try {
    const scores = await Score.find().sort({ time: 1 }).limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveScore, getScores };
