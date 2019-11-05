import React from 'react';
import PropTypes from 'prop-types';
import { convertColor } from '@knapsack/utils';
import { Spinner } from '@knapsack/design-system';
import { Details, Select } from '../atoms';
import './color-contrast-block.scss';

class ColorContrastBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bgColor: 'white',
      textColor: 'black',
      isReady: false,
      contrast: {
        aa: '',
        aaa: '',
        aaaLarge: '',
        aaLarge: '',
        ratio: '',
      },
      allResults: {},
    };
    this.checkColorContrast = this.checkColorContrast.bind(this);
  }

  async componentDidMount() {
    this.checkColorContrast();
    const colors = this.props.bgColors;
    const { textColors } = this.props;
    const results = await Promise.all(
      colors.map(async bgColor => {
        const comparisonResults = await Promise.all(
          textColors
            .filter(comparedColor => comparedColor.value !== bgColor.value)
            .map(async comparedColor => ({
              comparedColor,
              contrast: await ColorContrastBlock.getColorContrast(
                bgColor.value,
                comparedColor.value,
              ),
            })),
        );
        return {
          bgColor,
          comparisonResults,
        };
      }),
    ).catch(error => console.error('Error in Promise.all', error));
    console.log('Promise.all done', { results });

    this.setState({
      allResults: results,
      isReady: true,
    });
  }

  static async getColorContrast(bg, text) {
    const bgValue = convertColor(bg, 'hex').slice(1);
    const txtValue = convertColor(text, 'hex').slice(1);

    const url = `https://webaim.org/resources/contrastchecker/?fcolor=${txtValue}&bcolor=${bgValue}&api`;
    const result = await window
      .fetch(url)
      .then(res => res.json())
      .catch(error => console.error(error));
    return result;
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

  render() {
    if (!this.state.isReady) {
      return <Spinner />;
    }
    const colorBlocks = this.state.allResults.map(result => (
      <Details key={result.bgColor.name}>
        <summary>{result.bgColor.name}</summary>
        <div
          className="color-contrast-block__contrast-inner"
          key={result.bgColor.name}
        >
          <h3>{result.bgColor.name}</h3>
          <p className="col col--1">Variable</p>
          <p className="col col--2">Ratio</p>
          <p className="col col--3">AA</p>
          <p className="col col--4">AAA</p>
          <p className="col col--5">AA Large</p>
          <p className="col col--6">AAA Large</p>
          <div
            className="color-contrast-block__color-block"
            style={{
              backgroundColor: result.bgColor.value
                ? result.bgColor.value
                : 'auto',
            }}
          />
          <div className="color-contrast-block__row-wrapper">
            {result.comparisonResults.map(compared => (
              <div
                className="color-contrast-block__color-compare"
                key={compared.comparedColor.name}
              >
                <div
                  className="color-contrast-block__fade"
                  style={{
                    background: `linear-gradient(
                      to right,
                      ${
                        compared.comparedColor.value
                          ? compared.comparedColor.value
                          : 'auto'
                      } 40%,
                      transparent 80%
                    )`,
                  }}
                />
                <p>{compared.comparedColor.name}</p>
                <p
                  className={`color-contrast-block__new-ratio
                    ${
                      compared.contrast.ratio > 4.5
                        ? 'color-contrast-block__new-ratio--pass'
                        : ''
                    }`}
                >
                  {compared.contrast.ratio}
                </p>
                <p
                  className={`color-contrast-block__results
                    ${
                      compared.contrast.AAA === 'pass'
                        ? 'color-contrast-block__results--pass'
                        : ''
                    }`}
                >
                  {compared.contrast.AAA}
                </p>
                <p
                  className={`color-contrast-block__results
                    ${
                      compared.contrast.AA === 'pass'
                        ? 'color-contrast-block__results--pass'
                        : ''
                    }`}
                >
                  {compared.contrast.AA}
                </p>
                <p
                  className={`color-contrast-block__results
                    ${
                      compared.contrast.AAALarge === 'pass'
                        ? 'color-contrast-block__results--pass'
                        : ''
                    }`}
                >
                  {compared.contrast.AAALarge}
                </p>
                <p
                  className={`color-contrast-block__results
                    ${
                      compared.contrast.AALarge === 'pass'
                        ? 'color-contrast-block__results--pass'
                        : ''
                    }`}
                >
                  {compared.contrast.AALarge}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Details>
    ));
    /* eslint-disable jsx-a11y/label-has-for */
    return (
      <div>
        <div className="color-contrast-block__contrast-wrapper">
          {colorBlocks}
        </div>
        <br />
        <div className="color-contrast-block__accessability-dropdowns">
          Background Color:
          {this.props.bgColors.length > 0 && (
            <Select
              value={this.state.bgColor}
              items={this.props.bgColors.map(color => ({
                value: color.value,
                key: color.name,
                title: color.name,
              }))}
              handleChange={value => {
                this.setState({ bgColor: value }, () =>
                  this.checkColorContrast(),
                );
              }}
            />
          )}
          Text Color:
          {this.props.textColors.length > 0 && (
            <Select
              value={this.state.textColor}
              items={this.props.textColors.map(color => ({
                value: color.value,
                key: color.name,
                title: color.name,
              }))}
              handleChange={value => {
                this.setState({ textColor: value }, () =>
                  this.checkColorContrast(),
                );
              }}
            />
          )}
        </div>
        <div
          className="color-contrast-block__playground"
          style={{
            backgroundColor: this.state.bgColor ? this.state.bgColor : 'none',
          }}
        >
          <h3
            className="color-contrast-block__large-text"
            style={{
              color: this.state.textColor,
            }}
          >
            Large Text looks like this
          </h3>
          <h5
            className="color-contrast-block__small-text"
            style={{
              color: this.state.textColor,
            }}
          >
            small text looks like this
          </h5>
        </div>
        <div className="color-contrast-block__accessibility-info">
          <p>
            WCAG AAA:{' '}
            <span
              className={`color-contrast-block__accessibility-results
                ${
                  this.state.contrast.aaa === 'pass'
                    ? 'color-contrast-block__accessibility-results--pass'
                    : ''
                }`}
            >
              {this.state.contrast.aaa}
            </span>
          </p>
          <p>
            WCAG AA:{' '}
            <span
              className={`color-contrast-block__accessibility-results
                ${
                  this.state.contrast.aa === 'pass'
                    ? 'color-contrast-block__accessibility-results--pass'
                    : ''
                }`}
            >
              {this.state.contrast.aa}
            </span>
          </p>
          <p>
            WCAG AAA (Large Text):{' '}
            <span
              className={`color-contrast-block__accessibility-results
                ${
                  this.state.contrast.aaaLarge === 'pass'
                    ? 'color-contrast-block__accessibility-results--pass'
                    : ''
                }`}
            >
              {this.state.contrast.aaaLarge}
            </span>
          </p>
          <p>
            WCAG AA (Large Text):{' '}
            <span
              className={`color-contrast-block__accessibility-results
                ${
                  this.state.contrast.aaLarge === 'pass'
                    ? 'color-contrast-block__accessibility-results--pass'
                    : ''
                }`}
            >
              {this.state.contrast.aaLarge}
            </span>
          </p>
          <p>
            WCAG Ratio:{' '}
            <span
              className={`color-contrast-block__ratio
                ${this.state.contrast.ratio >
                  '4.5'} ? 'color-contrast-block__ratio--success' : ''`}
            >
              {this.state.contrast.ratio}
            </span>
          </p>
        </div>
        <br />
        <Details>
          <summary>WCAG Details</summary>
          <p>
            <a href="https://www.w3.org/TR/WCAG20/" target="blank">
              WCAG 2.0
            </a>{' '}
            standards require a contrast ratio of greater than 4.5:1 for normal
            text and 3:1 for large text. For AAA standards, normal text ratio
            must be greater than 7:1 and large text ratio must be greater than
            4.5:1. Large text is defined as anything 14pt bold or higher.
          </p>
        </Details>
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
