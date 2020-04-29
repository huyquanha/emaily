import { FETCH_USER } from '../actions/types';

// the initial state will be undefined, so we have to give it some default value (null in this case)
export default function (state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      // if action.payload is an object we return it. if action.payload == "" (user is not logged in) we return false
      return action.payload || false;
    default:
      return state;
  }
}
