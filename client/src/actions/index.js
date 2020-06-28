import axios from 'axios';
// if not a default export, the import must refer the same name in types.js, so the name has to be FETCH_USER
import { FETCH_USER, FETCH_SURVEYS } from './types';

// whenever fetchUser() is called, it will instantly return a function, that will make an ajax request to backend
// this returned function will goes through redux-thunk middleware that we already register in index.js
// redux-thunk will see that our action creator returns a function and will call it, passing in the dispatch function
// therefore, in the function signature here, we have a dispatch argument, because we anticipate redux-thunk will intercept
// and add in that dispatch function

// With the dispatch function, we can send the action to the reducers anytime we want, instead of immediately
// In this case, we want to dispatch an action only after our axios request has been successfully completed and returned
export const fetchUser = () => async (dispatch) => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

// action creator to send the stripe token to backend so we can make the actual billing there
// we use POST because we send some data (the token) together with the request
export const handleToken = (token) => async (dispatch) => {
  const res = await axios.post('/api/stripe', token);
  // assuming the response sends back the user model as well, we will reuse the FETCH_USER action type
  // so that it will also be handled by authReducer, and the header will be updated with the correct amount of credits
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async (dispatch) => {
  // "/api/surveys" will return the user after deducting the amount of credits
  const res = await axios.post('/api/surveys', values);
  // navigate our application to /surveys
  history.push('/surveys');
  // we use FETCH_USER again to update the user's credit in the header
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSurveys = () => async (dispatch) => {
  const res = await axios.get('/api/surveys');
  dispatch({ type: FETCH_SURVEYS, payload: res.data });
};
