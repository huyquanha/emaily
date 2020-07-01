import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SurveyList from './surveys/SurveyList';
import fields from './surveys/sortFields';
import * as _ from 'lodash';
import M from 'materialize-css/dist/js/materialize.min.js';
import { sortSurveys, fetchSurveys } from '../actions';
import { connect } from 'react-redux';
import '../styles/Dashboard.css';
import axios from 'axios';

class Dashboard extends Component {
  state = {
    pageCount: 0,
    activePage: 0,
    fieldName: '',
    order: '',
  };

  async componentDidMount() {
    M.AutoInit();
    const res = await axios.get('/api/surveys/pageCount');
    const pageCount = res.data.pageCount;
    this.setState({
      pageCount,
      activePage: pageCount ? 1 : this.state.activePage,
    });
  }

  onChange = (e) => {
    this.setState(
      {
        ...this.state,
        [e.target.name]: e.target.value,
      },
      () => {
        if (this.state.fieldName && this.state.order) {
          this.props.sortSurveys(this.state.fieldName, this.state.order);
        }
      }
    );
  };

  onPageChange = (i) => {
    return (e) => {
      this.setState(
        {
          activePage: i,
        },
        () => {
          this.props.fetchSurveys(this.state.activePage);
        }
      );
    };
  };

  renderRadioButton = (value, label) => {
    return (
      <div className="horizontal col s6">
        <label>
          <input
            className="with-gap"
            name="order"
            type="radio"
            value={value}
            onChange={this.onChange}
            checked={this.state.order === value}
          />
          <span>{label}</span>
        </label>
      </div>
    );
  };

  renderSelect = () => {
    return (
      <select
        name="fieldName"
        value={this.state.fieldName}
        onChange={this.onChange}
      >
        <option value="" disabled>
          Sort by
        </option>
        {_.map(fields, (f) => {
          return (
            <option key={f.name} value={f.name}>
              {f.label}
            </option>
          );
        })}
      </select>
    );
  };

  renderPagination() {
    return (
      !!this.state.pageCount && (
        <ul className="pagination center">
          <li className="disabled">
            <a href="#!">
              <i className="material-icons">chevron_left</i>
            </a>
          </li>
          {_.chain(this.state.pageCount)
            .range()
            .map((i) => i + 1)
            .map((i) => {
              const cssClasses = [];
              if (i === this.state.activePage) cssClasses.push('active');
              else cssClasses.push('waves-effect');
              return (
                <li key={i} className={cssClasses}>
                  <a onClick={this.onPageChange(i)}>{i}</a>
                </li>
              );
            })
            .value()}
          <li className="waves-effect">
            <a href="#!">
              <i className="material-icons">chevron_right</i>
            </a>
          </li>
        </ul>
      )
    );
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="input-field col s12 m6">{this.renderSelect()}</div>
          <div className="input-field col s12 m6">
            <div className="row input-field">
              {this.renderRadioButton('asc', 'Ascending')}
              {this.renderRadioButton('desc', 'Descending')}
            </div>
          </div>
        </div>
        <SurveyList />
        {this.renderPagination()}
        <div className="fixed-action-btn">
          {/* we want to use a Link tag here instead of <a> so we don't cause a whole page refresh, just redirect to another route 
            controlled by React Router*/}
          <Link className="btn-floating btn-large red" to="/surveys/new">
            <i className="material-icons">add</i>
          </Link>
        </div>
      </div>
    );
  }
}

export default connect(null, { sortSurveys, fetchSurveys })(Dashboard);
