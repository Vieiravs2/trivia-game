export const SAVE_USER_DATA = 'SAVE_USER_DATA';
export const SAVE_QUESTIONS_DATA = 'SAVE_QUESTIONS_DATA ';
export const ADD_SCORE = 'ADD_SCORE';
export const CLEAR_PLAYER = 'CLEAR_PLAYER';

export const saveUserData = (payload) => ({
  type: SAVE_USER_DATA,
  payload,
});

export const addScore = (timer, difficulty) => ({
  type: ADD_SCORE,
  timer,
  difficulty,
});

export const saveQuestionsData = (payload) => ({
  type: SAVE_QUESTIONS_DATA,
  payload,
});

export const tokenTrivia = async () => {
  const API_TOKEN = 'https://opentdb.com/api_token.php?command=request';
  const response = await fetch(API_TOKEN);
  const { token } = await response.json();
  return localStorage.setItem('token', token);
};

export const clearPlayer = () => ({
  type: CLEAR_PLAYER,
});
