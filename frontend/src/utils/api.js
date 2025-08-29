import axios from 'axios';

const API_URL = 'http://localhost:5000/api/scores';

export const saveScore = async (username, time) => {
  try {
    const response = await axios.post(API_URL, { username, time });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getScores = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
