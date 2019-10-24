import React from 'react';
import PropTypes from 'prop-types';
import './select-styled-wrapper.scss';
import shortid from 'shortid';

export class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: this.props.items[props.initialItem].value,
      uniqueId: `select--${shortid.generate()}`,
    };
    this.handleSelection = this.handleSelection.bind(this);
  }

  handleSelection(event) {
    this.setState({
      currentValue: event.target.value,
    });
    this.props.handleChange(event.target.value);
  }

  render() {
    let { currentValue } = this.state;
    const { uniqueId } = this.state;
    /* eslint-disable react/prop-types */
    if (this.props.value) {
      currentValue = this.props.value;
    }
    /* eslint-enable react/prop-types */
    return (
      <label
        className="k-select-styled-wrapper"
        htmlFor={uniqueId}
        tabIndex="0"
      >
        {this.props.label && (
          <div className="label-text">{this.props.label}</div>
        )}
        <span>
          <select
            onChange={this.handleSelection}
            value={currentValue}
            id={uniqueId}
          >
            {this.props.items.map(item => (
              <option tabIndex={0} value={item.value} key={item.value}>
                {item.title ? item.title : item.value}
              </option>
            ))}
          </select>
        </span>
      </label>
    );
  }
}

Select.defaultProps = {
  initialItem: 0,
  label: '',
};

Select.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleChange: PropTypes.func.isRequired,
  initialItem: PropTypes.number,
  label: PropTypes.string,
};
