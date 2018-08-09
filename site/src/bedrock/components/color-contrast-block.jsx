import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { convertColor } from '../packages/utils';
import { Details, SelectStyledWrapper } from './atoms';

const ColorContrastPlayground = styled.div`
  width: 100%;
  margin-bottom: 10px;
  padding: 2rem;
  border: solid 1px grey;
  text-align: center;
  background-color: ${props => (props.bgColor ? props.bgColor : 'none')};
`;

const AccessabilityDropdowns = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const AccessibilityInfo = styled.div`
  p {
    display: inline-block;
    margin: 0.5rem 1rem;
  }
`;

const AccessibilityResults = styled.span`
  background-color: ${props => (props.pass === 'pass' ? 'green' : 'red')};
  color: white;
  text-align: center;
  border-radius: 0;
  font-weight: bold;
  display: inline;
  padding: 0.35rem 0.75rem;
`;

const Ratio = styled.span`
  border: 1px solid ${props => (props.ratio > '4.5' ? 'green' : 'red')};
  color: ${props => (props.ratio > '4.5' ? 'green' : 'red')};
  text-align: center;
  border-radius: 0;
  font-weight: bold;
  display: inline;
  padding: 0.35rem 1rem;
`;

const LargeText = styled.h3`
  font-weight: bold;
  color: ${props => props.color};
`;

const SmallText = styled.h5`
  color: ${props => props.color};
  font-weight: normal;
`;

class ColorContrastBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bgColor: 'white',
      textColor: 'black',
      contrast: {
        aa: '',
        aaa: '',
        aaaLarge: '',
        aaLarge: '',
        ratio: '',
      },
    };
    this.checkColorContrast = this.checkColorContrast.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.checkColorContrast();
  }

  checkColorContrast() {
    const bgValue = convertColor(this.state.bgColor, 'hex').slice(1);
    const txtValue = convertColor(this.state.textColor, 'hex').slice(1);

    const url = `https://webaim.org/resources/contrastchecker/?fcolor=${txtValue}&bcolor=${bgValue}&api`;

    window
      .fetch(url)
      .then(res => res.json())
      .then(results => {
        this.setState({
          contrast: {
            aa: results.AA,
            aaa: results.AAA,
            aaaLarge: results.AAALarge,
            aaLarge: results.AALarge,
            ratio: results.ratio,
          },
        });
      });
  }

  handleChange(type, color) {
    this.setState(
      {
        [type]: color,
      },
      () => this.checkColorContrast(),
    );
  }

  render() {
    const bgColors = this.props.bgColors.map(color => (
      <option value={color.value} key={color.name}>
        {color.name}
      </option>
    ));
    const textColors = this.props.textColors.map(color => (
      <option value={color.value} key={color.name}>
        {color.name}
      </option>
    ));

    /* eslint-disable jsx-a11y/label-has-for */
    return (
      <div>
        <AccessabilityDropdowns>
          Background Color:
          <SelectStyledWrapper>
            <select
              value={this.state.bgColor}
              onChange={event =>
                this.handleChange('bgColor', event.target.value)
              }
            >
              {bgColors}
            </select>
          </SelectStyledWrapper>
          Text Color:
          <SelectStyledWrapper>
            <select
              value={this.state.textColor}
              onChange={event =>
                this.handleChange('textColor', event.target.value)
              }
            >
              {textColors}
            </select>
          </SelectStyledWrapper>
        </AccessabilityDropdowns>
        <ColorContrastPlayground bgColor={this.state.bgColor}>
          <LargeText color={this.state.textColor}>
            Large Text looks like this
          </LargeText>
          <SmallText color={this.state.textColor}>
            small text looks like this
          </SmallText>
        </ColorContrastPlayground>
        <AccessibilityInfo>
          <p>
            WCAG AAA:{' '}
            <AccessibilityResults pass={this.state.contrast.aaa}>
              {this.state.contrast.aaa}
            </AccessibilityResults>
          </p>
          <p>
            WCAG AA:{' '}
            <AccessibilityResults pass={this.state.contrast.aa}>
              {this.state.contrast.aa}
            </AccessibilityResults>
          </p>
          <p>
            WCAG AAA (Large Text):{' '}
            <AccessibilityResults pass={this.state.contrast.aaaLarge}>
              {this.state.contrast.aaaLarge}
            </AccessibilityResults>
          </p>
          <p>
            WCAG AA (Large Text):{' '}
            <AccessibilityResults pass={this.state.contrast.aaLarge}>
              {this.state.contrast.aaLarge}
            </AccessibilityResults>
          </p>
          <p>
            WCAG Ratio:{' '}
            <Ratio ratio={this.state.contrast.ratio}>
              {this.state.contrast.ratio}
            </Ratio>
          </p>
        </AccessibilityInfo>
        <br />
        <Details>
          <summary>WCAG Details</summary>
          <p>
            <a href={'https://www.w3.org/TR/WCAG20/'} target={'blank'}>
              WCAG 2.0
            </a>{' '}
            standards require a contrast ratio of greater than 4.5:1 for normal
            text and 3:1 for large text. For AAA standards, normal text ratio
            must be greater than 7:1 and large text ratio must be greater than
            4.5:1. Large text is defined as anything 14pt bold or higher.
          </p>
        </Details>
        <br />
      </div>
    );
  }
}

ColorContrastBlock.defaultProps = {};

ColorContrastBlock.propTypes = {
  bgColors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      comment: PropTypes.string.isRequired,
    }),
  ).isRequired,
  textColors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      comment: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ColorContrastBlock;