import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Checkerboard = styled.div`
  background-image: linear-gradient(
      45deg,
      rgb(230, 230, 230) 25%,
      transparent 25%
    ),
    linear-gradient(-45deg, rgb(230, 230, 230) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgb(230, 230, 230) 75%),
    linear-gradient(-45deg, transparent 75%, rgb(230, 230, 230) 75%);
  background-size: 20px 20px;
  background-position: 0px 0px, 0px 10px, 10px -10px, -10px 0px;
  padding: ${props => props.bleed && props.bleed};
  > div {
    display: flex;
    justify-content: center;
    background-color: rgba(77, 77, 77, 0.15);
    padding: 10px;
  }
`;

export const Details = styled.details`
  padding: 7px 0;
  border-top: solid 1px grey;
  border-bottom: solid 1px grey;
  margin-bottom: 10px;
  > summary {
    font-weight: bold;
    outline: none;
    user-select: none;
    font-size: 1.1rem;
    &:hover {
      cursor: pointer;
    }
    &:active,
    &:focus {
      outline: none;
    }
  }
`;

export const SelectStyledWrapper = styled.label`
  display: inline-block;
  height: 33px;
  overflow: hidden;
  padding-right: 3px;
  margin: 0 5px;
  > .label-text {
    display: inline-block;
    margin-right: 5px;
    &:after {
      content: ':';
    }
  }
  > span > select {
    background-color: lightgrey;
    font-size: 1rem;
    border: 0;
    height: 33px;
    padding: 5px; /* If you add too much padding here, the options won't show in IE */
    &:active,
    &:focus {
      outline: none;
    }
  }
  > span {
    display: inline-block;
    background-color: lightgrey;
    border: 0;
    border-radius: 0;
    height: 33px;
  }
`;

export class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: this.props.items[props.initialItem].value,
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
    /* eslint-disable react/prop-types */
    if (this.props.value) {
      currentValue = this.props.value;
    }
    /* eslint-enable react/prop-types */
    return (
      <SelectStyledWrapper>
        {this.props.label && (
          <div className="label-text">{this.props.label}</div>
        )}
        <span>
          <select onChange={this.handleSelection} value={currentValue}>
            {this.props.items.map(item => (
              <option value={item.value} key={item.value}>
                {item.title ? item.title : item.value}
              </option>
            ))}
          </select>
        </span>
      </SelectStyledWrapper>
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

export const TwoUp = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2.25rem;
  & > * {
    width: 48%;
  }
`;

export const SelectWrapper = styled.div`
  display: inline-block;
  height: 33px;
  overflow: hidden;
  background-color: lightgrey;
  font-size: 1rem;
  border: 0;
  > select {
    background-color: lightgrey;
    font-size: 1rem;
    border: 0;
    height: 33px;
    padding: 5px; /* If you add too much padding here, the options won't show in IE */
    &:active,
    &:focus {
      outline: none;
    }
  }
`;

export const TextInputWrapper = styled.div`
  > input,
  > textarea {
    box-sizing: border-box;
    padding: 3px 8px;
    border: 1px solid lightgrey;
    background-color: white;
    font-size: 15px;
    width: 100%;
  }
  > input {
    height: 33px;
  }
`;

export const RadioInputWrapper = styled.div`
  height: 33px;
  .radio {
    margin-right: 13.5px;
  }
  input {
    margin-right: 8px;
  }
`;

export const CheckboxInputWrapper = styled.div`
  p {
    display: none;
  }
  label {
    height: 33px;
    display: flex;
    align-items: center;
  }
  input {
    margin-right: 8px;
  }
`;

export const FormIconButton = styled.div`
  display: inline-block;
  width: 21px;
  height: 21px;
  background-size: contain;
  position: relative;
  cursor: ${props => (props.active ? 'pointer' : 'auto')};
  &::after {
    background: ${props =>
      props.backgroundImage ? props.backgroundImage : ''};
    background-size: contain;
    opacity: ${props => (props.active ? 1 : 0.25)};
    content: '';
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: -1;
  }
`;

export const FormIconTray = styled.div`
  box-sizing: border-box;
  border: solid 1px lightgrey;
  display: inline-flex;
  padding: 5px 8px;
`;

export const FormArrayItem = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.5rem;
  .field {
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  & > * + * {
    margin-left: 0.25rem;
  }
`;

export const BlockQuoteWrapper = styled.blockquote`
  border-left: solid 6px ${props => props.color || '#16394B'};
  padding: 2.25rem 4rem;
  position: relative;
  //box shadow
  -moz-box-shadow: 2px 2px 15px #ccc;
  -webkit-box-shadow: 2px 2px 15px #ccc;
  box-shadow: 2px 2px 15px #ccc;
  footer {
    font-size: 0.8em;
    color: #888889;
    margin-top: 0.5rem;
  }
  ::before {
    content: '\\201C'; /*Unicode for Left Double Quote*/
    /*Font*/
    font-family: Georgia, serif;
    font-size: 200px;
    opacity: 0.2;
    font-weight: bold;
    color: #999;

    /*Positioning*/
    position: absolute;
    left: 0px;
    top: -53px;
  }
  ::after {
    content: '\\201D'; /*Unicode for Right Double Quote*/
    font-family: Georgia, serif;
    font-size: 200px;
    opacity: 0.2;
    font-weight: bold;
    color: #999;
    position: absolute;
    right: 40px;
    bottom: -137px;
  }
`;
