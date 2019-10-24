import React from 'react';
import PropTypes from 'prop-types';
import deviceWidths from './device-widths';
import './breakpoints-demo.scss';

const BreakpointsItems = items =>
  items.map(item => (
    <li
      className="breakpoints-demo__breakpoint-item"
      key={item.name}
      style={{
        left: item.value,
      }}
    >
      <span className="label">
        {item.name}:<br />
        {item.value}
      </span>
    </li>
  ));

const BreakpointList = ({ items }) => (
  <ul className="breakpoints">{BreakpointsItems(items)}</ul>
);

BreakpointList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const DeviceWidthsItems = items =>
  items.map(item => (
    <li
      className="breakpoints-demo__device-item"
      key={item.name}
      style={{
        width: item.width,
      }}
    >
      <span className="label">
        {item.name}: {item.width}
      </span>
    </li>
  ));

const DeviceWidthList = ({ items }) => (
  <ul className="breakpoints-demo__device-width-list">
    {DeviceWidthsItems(items)}
  </ul>
);

DeviceWidthList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

const BreakpointsDemo = ({ breakpoints }) => (
  <div className="breakpoints-demo__breakpoint-list">
    <BreakpointList items={breakpoints} />
    <DeviceWidthList items={deviceWidths} />
  </div>
);

BreakpointsDemo.propTypes = {
  breakpoints: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default BreakpointsDemo;
