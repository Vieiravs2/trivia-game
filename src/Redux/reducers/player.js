import { SAVE_USER_DATA, ADD_SCORE, CLEAR_PLAYER } from '../actions/index';

const INITIAL_STATE = {
  name: '',
  assertions: 0,
  score: 0,
  gravatarEmail: '',
  rightQuestions: 0,
};

export const player = (state = INITIAL_STATE, action) => {
  const addScore = 10;
  switch (action.type) {
  case SAVE_USER_DATA:
    return {
      ...state,
      ...action.payload,
    };
  case ADD_SCORE:
    return {
      ...state,
      assertions: state.assertions + 1,
      score: state.score + addScore + (action.timer * action.difficulty),
    };
  case CLEAR_PLAYER:
    return {
      ...state,
      name: '',
      assertions: 0,
      score: 0,
      gravatarEmail: '',
      rightQuestions: 0,
    };
  default:
    return state;
  }
};
