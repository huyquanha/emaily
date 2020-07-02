import React from 'react';
import * as _ from 'lodash';
import fields from './surveys/sortFields';

export default ({ fieldName, order, onChange }) => {
  const select = (
    <select name="fieldName" value={fieldName} onChange={onChange}>
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

  const renderRadioButton = (value, label) => (
    <div className="horizontal col s6">
      <label>
        <input
          className="with-gap"
          name="order"
          type="radio"
          value={value}
          onChange={onChange}
          checked={value === order}
        />
        <span>{label}</span>
      </label>
    </div>
  );

  return (
    <div className="row">
      <div className="input-field col s12 m6">{select}</div>
      <div className="input-field col s12 m6">
        <div className="row input-field">
          {renderRadioButton('asc', 'Ascending')}
          {renderRadioButton('desc', 'Descending')}
        </div>
      </div>
    </div>
  );
};
