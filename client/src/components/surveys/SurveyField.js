// SurveyField contains logic to render a single label and text input
import React from 'react';

/*
    because our SurveyField is rendered by Redux form's Field component,
    it get passed a lot of props. We are mainly interested in props.input
    which contains all the event handlers that Redux form provides for our component (onBlur, onChange...)
    Therefore, we use ES6 object destructuring to take only the input out of props and pass it to our <input> tag

    We also take the meta prop, which will contain the validation error (if exists).
    Another property of interest in our meta object is the touched property. if touched == true, that means
    user has clicked into the field, and then click out
*/
export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      {/* this shorthand notation is equivalent to writing onBlur={input.onBlur} onChange={input.onChange}... */}
      {/* we need to pass these event handlers to our <input> tag so any changes to our input's value are propagated back to 
      our Redux Form to be stored in the Redux store*/}
      <input {...input} style={{ marginBottom: '5px' }} />
      {/** if touched is true, we show the error (if it is truthy (not null, undefined, empty...)) */}
      {/** if touched is false, that's when the form first renders and there will definitely
       * be errors (because all field are initially empty) but we shouldn't show errors
       * because the user hasn't interacted with our form yet */}
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
    </div>
  );
};
