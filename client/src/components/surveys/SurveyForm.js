// SurveyForm shows a form for users to add inputs
// lodash has a map helper function
import _ from 'lodash';
import React, { Component } from 'react';
// this helper allows Redux form inside our component to communicate with Redux store
// in a sense, it works just like connect()
import { reduxForm, Field } from 'redux-form';
import SurveyField from './SurveyField';
import { Link } from 'react-router-dom';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
  renderFields() {
    return _.map(formFields, ({ label, name }) => {
      /** whenever Redux Form tries to show a Field, it will call our SurveyField and
       * trust us to render the necessary html. Any custom props passed to Field (ex: label) will
       * automatically be passed on to our SurveyField component */
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          name={name}
          label={label}
        />
      );
    });
  }

  render() {
    return (
      <div>
        {/* this.props.handleSubmit is added to SurveyForm by reduxForm() at the bottom */}
        {/* we dont place () after this.props.onSurveySubmit so it won't be called instantly the second our app renders,
        but only after the user has submitted the form */}
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

// values contain all the values coming out of our form
function validate(values) {
  // errors will be returned to Redux form. If it is empty, Redux form will assume everything is fine
  // and continue on to submit our form. Otherwise, it stops the submission process
  const errors = {};

  // because the validate function will run one time when the application first boots up, and at that time
  // values.recipients is still undefined, we will replace it with '' instead to avoid exception when splitting on undefined
  errors.recipients = validateEmails(values.recipients || '');

  errors.from = validateEmails(values.from || '');

  // notice we use the same property name (ex: title) for errors
  // when Redux form sees this it will match up this error with the field of the same name (title)
  // and pass the error as a prop to our custom component (SurveyField of Field named title) so we can show it
  _.each(formFields, ({ name }) => {
    // this [] syntax is used to access a property at run time. If we use values.name, javascript will try to look
    // for a property named "name" instead
    if (!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });

  return errors;
}

export default reduxForm({
  // when we pass a validate function as the validate property here
  // the function will be run everytime the user tries to submit the form
  // Since the function name and the property name are the same, we use ES6 shorthand syntax here
  validate,
  // true by default: Redux form will dump the form values everytime SurveyForm is unmounted (no longer shown on screen)
  // false: keep the field values arround even if this component is unmounted
  destroyOnUnmount: false,
  // this will link this component to a property named "surveyForm" under "form"
  // in the Redux store to hold all our survey form data
  form: 'surveyForm',
})(SurveyForm);
