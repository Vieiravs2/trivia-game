import { SAVE_QUESTIONS_DATA } from '../actions';

const INITIAL_STATE = {
  questions: {
    response_code: 0,
    results: undefined,
  },
};

export const game = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case SAVE_QUESTIONS_DATA:
    return {
      ...state,
      questions: action.payload,
    };
  default:
    return state;
  }
};
