import { types } from "../types/types";

const initialState = {
  scores: [],
};
export const leaderboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.leaderboardLoadScoresMes:
      return {
        ...state,
        scores: [...action.payload]
      }
    default:
      return state;
  }
};
