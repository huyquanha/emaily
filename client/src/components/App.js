// on front end we are making use of webpack and babel, so we have easy access to ES2015 (ES6) modules
// so we can use this import syntax instead of require syntax on back end
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Header from './Header';
import Landing from './Landing';

const Dashboard = () => <h2>Dashboard</h2>;
const SurveyNew = () => <h2>SurveyNew</h2>;

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div className="container">
        {/* BrowserRouter expects at MOST ONE child => wrap the Routes inside a div */}
        <BrowserRouter>
          <div>
            {/* will always appear */}
            <Header />
            {/* "/" is assumed by React to mean the root URL */}
            {/* React Router will check if the current URL matches any of the routes defined below. If it match, the route's component is displayed*/}
            {/* By adding exact, we make sure that the current URL has to match the path exactly. So "/surveys" will only match the second route, not the first */}
            <Route exact path="/" component={Landing} />
            {/* Same here, adding exact will make sure that "/surveys/new" will only match the third route, not the second route */}
            <Route exact path="/surveys" component={Dashboard} />
            <Route path="/surveys/new" component={SurveyNew} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

// The connect() function connects a React component to a Redux store.
// It provides its connected component with the pieces of the data it needs from the store, and the functions it can use to dispatch actions to the store.
// It does not modify the component class passed to it; instead, it returns a new, connected component class that wraps the component you passed in.
// 1st argument is mapStateToProps() function to map the store's state to component's props. we don't use this here, so null
// 2nd argument is mapDispatchToProps(), where we can map the action creators to component's props, so we can call the action
// creators from inside the component and dispatching actions to the store.
export default connect(null, actions)(App);
