import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Payments from './Payments';

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        // the ajax request hasn't finished yet, so we don't know if user is logged in or not. We render nothing
        return;
      case false:
        // ajax request finished, user is not currently logged in. Show the "Sign in with Google"
        return (
          <li>
            <a href="/auth/google">Login With Google</a>
          </li>
        );
      default:
        // ajax request finsihed, user is currently logged in.
        return [
          <li key="1">
            <Payments />
          </li>,
          <li key="3" style={{ margin: '0 10px' }}>
            Credits: {this.props.auth.credits}
          </li>,
          <li key="2">
            <a href="/api/logout">Logout</a>
          </li>,
        ];
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link
            to={this.props.auth ? '/surveys' : '/'}
            className="left brand-logo"
          >
            Emaily
          </Link>
          <ul className="right">{this.renderContent()}</ul>
        </div>
      </nav>
    );
  }
}

// this function will be called with the entire state from Redux store. We use ES6 object destructuring here because
// we only need the auth property in state
function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
