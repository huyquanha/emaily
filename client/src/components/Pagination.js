import React from 'react';
import * as _ from 'lodash';

// limit the amount of list entries shown at a time to [activePage - DISPLAY_OFFSET, activePage + DISPLAY_OFFSET]
const DISPLAY_OFFSET = 2;

const getCssClass = (activePage, i) => {
  if (i === activePage) {
    return 'active';
  }
  return 'waves-effect';
};

const getLeftCssClass = (activePage) => {
  if (activePage === 1) return 'disabled';
  return 'waves-effect';
};

const getRightCssClass = (activePage, pageCount) => {
  if (activePage === pageCount) return 'disabled';
  return 'waves-effect';
};

const getRenderList = (activePage, pageCount) => {
  const visibleSize = 2 * DISPLAY_OFFSET + 1;
  let start = 1,
    end = pageCount;
  if (pageCount <= visibleSize) return _.range(start, end + 1);
  if (
    activePage - DISPLAY_OFFSET > 1 &&
    activePage + DISPLAY_OFFSET < pageCount
  ) {
    start = activePage - DISPLAY_OFFSET;
    end = activePage + DISPLAY_OFFSET;
  } else if (activePage - DISPLAY_OFFSET <= 1) {
    end = visibleSize;
  } else {
    start = pageCount - visibleSize + 1;
  }
  return _.range(start, end + 1);
};

const renderPageList = (activePage, pageCount, onPageChange) => {
  const visibleEntries = getRenderList(activePage, pageCount);
  return _.map(visibleEntries, (i) => (
    <li key={i} className={getCssClass(activePage, i)}>
      <a onClick={onPageChange(i)}>{i}</a>
    </li>
  ));
};

export default ({ pageCount, activePage, onPageChange }) => {
  return (
    <ul className="pagination center">
      <li className={getLeftCssClass(activePage)}>
        <a onClick={onPageChange(activePage - 1)}>
          <i className="material-icons">chevron_left</i>
        </a>
      </li>
      {renderPageList(activePage, pageCount, onPageChange)}
      <li className={getRightCssClass(activePage, pageCount)}>
        <a onClick={onPageChange(activePage + 1)}>
          <i className="material-icons">chevron_right</i>
        </a>
      </li>
    </ul>
  );
};
