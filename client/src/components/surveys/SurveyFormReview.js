// SurveyFormReview show users their form inputs for review
import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import _ from 'lodash';
import { submitSurvey } from '../../actions';
import { withRouter } from 'react-router-dom';

// onCancel prop comes from SurveyNew
// submitSurvey props comes from actions (mapDispatchToProps in the connect() call)
// formValues comes from mapStateToProps (also through connect())
// history comes from withRouter()
const SurveyReview = ({ onCancel, formValues, submitSurvey, history }) => {
  const reviewFields = _.map(formFields, ({ label, name }) => {
    return (
      <div key={name}>
        <label>{label}</label>
        <div>{formValues[name]}</div>
      </div>
    );
  });

  return (
    <div>
      <h5>Please confirm your entries</h5>
      {reviewFields}
      <button
        className="yellow white-text darken-3 btn-flat"
        onClick={onCancel}
      >
        Back
      </button>
      <button
        className="green white-text btn-flat right"
        onClick={() => submitSurvey(formValues, history)}
      >
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    // this will be passed as props.formValues to SurveyReview
    formValues: state.form.surveyForm.values,
  };
}

export default connect(mapStateToProps, { submitSurvey })(
  withRouter(SurveyReview)
);
