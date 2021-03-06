import { FETCH_SURVEYS, DELETE_SURVEY } from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case FETCH_SURVEYS:
      // we want the most recently created ones to appear first by default
      return action.payload;
    case DELETE_SURVEY:
      return state.filter((survey) => survey._id !== action.payload);
    default:
      return state;
  }
}
