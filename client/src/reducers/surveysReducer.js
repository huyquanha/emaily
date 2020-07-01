import { FETCH_SURVEYS, DELETE_SURVEY, SORT_SURVEYS } from '../actions/types';
import * as _ from 'lodash';

export default function (state = [], action) {
  switch (action.type) {
    case FETCH_SURVEYS:
      // we want the most recently created ones to appear first by default
      return action.payload.reverse();
    case DELETE_SURVEY:
      return state.filter((survey) => survey._id !== action.payload);
    case SORT_SURVEYS:
      const { fieldName, order } = action.payload;
      return _.orderBy(state, [fieldName], [order]);
    default:
      return state;
  }
}
