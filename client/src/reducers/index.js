import { combineReducers } from 'redux';
import authReducer from './authReducer';
import surveysReducer from './surveysReducer';
// we have to use the name reducer as it is exported as that name from redux-form (not an export default)
// with the help of the ES6 feature "as", we can freely rename it to whatever we want
import { reducer as reduxForm } from 'redux-form';

export default combineReducers({
  // whatever keys we provide to this object will represent the keys that exist inside our state object
  auth: authReducer,
  // reduxForm expects the key to be "form", so we don't have much choice here
  // if we want to assign the key "form" to another reducer in our app, head to the redux-form documentation
  // to see how we could use a different key name for reduxForm
  form: reduxForm,
  surveys: surveysReducer,
});
