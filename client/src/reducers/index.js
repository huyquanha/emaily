import { combineReducers } from 'redux';
import authReducer from './authReducer';

export default combineReducers({
  // whatever keys we provide to this object will represent the keys that exist inside our state object
  auth: authReducer,
});
