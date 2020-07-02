import React, { Component } from 'react';

export default class SurveyList extends Component {
  renderSurveys() {
    return this.props.surveys.map((survey) => {
      return (
        <div className="card blue-grey darken-1" key={survey._id}>
          <div className="card-content white-text">
            <span className="card-title">{survey.title}</span>
            <p>Subject Line: {survey.subject}</p>
            {survey.from && (
              <p>
                <em>From: {survey.from}</em>
              </p>
            )}
            <br />
            <p>{survey.body}</p>
            <br />
            <p>
              {survey.lastResponded && (
                <span>
                  Last Responded:{' '}
                  {new Date(survey.lastResponded).toLocaleDateString()}
                </span>
              )}
              <span className="right">
                Sent On: {new Date(survey.dateSent).toLocaleDateString()}
              </span>
            </p>
          </div>
          <div className="card-action">
            <a>Yes: {survey.yes}</a>
            <a>No: {survey.no}</a>
            <button
              className="red white-text btn-flat right"
              onClick={() => this.props.onDeleteSurvey(survey._id)}
            >
              Delete Survey
              <i className="material-icons right">delete</i>
            </button>
          </div>
        </div>
      );
    });
  }

  render() {
    return <div>{this.renderSurveys()}</div>;
  }
}
