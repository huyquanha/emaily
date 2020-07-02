import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SurveyList from './surveys/SurveyList';
import Pagination from './Pagination';
import SurveyFilter from './SurveyFilter';
import * as _ from 'lodash';
import M from 'materialize-css/dist/js/materialize.min.js';
import { fetchSurveys, deleteSurvey } from '../actions';
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
    const pageCount = await this.fetchPageCount();
    this.setState(
      {
        pageCount,
        activePage: pageCount ? 1 : this.state.activePage,
      },
      () =>
        this.state.activePage && this.props.fetchSurveys(this.state.activePage)
    );
  }

  async fetchPageCount() {
    const res = await axios.get('/api/surveys/pageCount');
    return res.data.pageCount;
  }

  handleFilterChange = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };

  handlePageChange = (i) => {
    return (e) => {
      // prevent clicking if the new index i is out of range or doesn't change
      if (i < 1 || i > this.state.pageCount || i === this.state.activePage)
        return false;
      this.setState(
        {
          activePage: i,
        },
        async () => {
          this.props.fetchSurveys(this.state.activePage);
          const res = await axios.get('/api/surveys/pageCount');
          this.setState({
            pageCount: res.data.pageCount,
          });
        }
      );
    };
  };

  getSortedSurveyList = () => {
    if (this.state.fieldName && this.state.order) {
      return _.orderBy(
        this.props.surveys,
        [this.state.fieldName],
        [this.state.order]
      );
    }
    return this.props.surveys;
  };

  render() {
    return (
      <div>
        <SurveyFilter
          fieldName={this.state.fieldName}
          order={this.state.order}
          onChange={this.handleFilterChange}
        />
        <SurveyList
          surveys={this.getSortedSurveyList()}
          onDeleteSurvey={(surveyId) => this.props.deleteSurvey(surveyId)}
        />
        {!!this.state.pageCount && (
          <Pagination
            pageCount={this.state.pageCount}
            activePage={this.state.activePage}
            onPageChange={this.handlePageChange}
          />
        )}
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

function mapStateToProps({ surveys }) {
  return { surveys };
}

export default connect(mapStateToProps, { fetchSurveys, deleteSurvey })(
  Dashboard
);
