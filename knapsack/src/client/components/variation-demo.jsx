/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { SchemaForm, TabbedPanel } from '@knapsack/design-system';
import { getTypeColor } from '../context';
import Template from './template';
import './variation-demo.scss';

export class VariationDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      isExpanded: props.isExpanded,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {}

  handleChange(data) {
    this.setState(prevState => ({
      data: { ...prevState.data, ...data.formData },
    }));
  }

  render() {
    const { prop, propKey } = this.props;
    const colorTheme = getTypeColor(this.props.color);
    const colorThemeAccent = getTypeColor(this.props.color, 'accent');
    const formSchema = {
      type: 'object',
      properties: {
        [propKey]: prop,
      },
    };

    let content;
    if (this.state.isExpanded) {
      // Items is either an enum of strings, or a boolean
      const items = prop.enum ? prop.enum : [true, false];
      content = items.map(item => {
        const itemData = { ...this.props.data, [propKey]: item };
        return (
          <div
            className="ks-variation-demo__variation-expanded"
            style={{ borderBottomColor: colorTheme }}
            key={JSON.stringify(itemData)}
          >
            <h4
              style={{
                borderBottomColor: colorTheme,
                color: colorTheme,
              }}
            >
              <code>{propKey}</code>:{' '}
              <code>
                {typeof item === 'boolean' ? JSON.stringify(item) : item}
              </code>
            </h4>
            <div className="ks-variation-demo__checkerboard">
              <Template
                templateId={this.props.templateId}
                patternId={this.props.patternId}
                data={itemData}
              />
            </div>
          </div>
        );
      });
    } else {
      const formUi = {};

      if (prop.type !== 'boolean') {
        formUi[propKey] = {
          'ui:widget': 'radio',
        };
      }

      content = (
        <div>
          <div
            className="ks-variation-demo__variation-item"
            style={{ borderBottomColor: colorTheme }}
          >
            <SchemaForm
              schema={formSchema}
              onChange={this.handleChange}
              formData={this.state.data}
              isInline
              uiSchema={formUi}
            />
          </div>
          <div className="ks-variation-demo__checkerboard">
            <Template
              templateId={this.props.templateId}
              patternId={this.props.patternId}
              showDataUsed={false}
              data={this.state.data}
            />
          </div>
        </div>
      );
    }

    return (
      <div>
        <div
          className="ks-variation-demo__header-region"
          style={{
            background: colorThemeAccent,
            borderBottomColor: colorTheme,
          }}
        >
          {prop.description && (
            <div>
              <h5 style={{ color: colorTheme }}>Description</h5>
              <p>{prop.description}</p>
            </div>
          )}
          <div
            className="ks-variation-demo__header-region__inner"
            style={{ color: colorTheme }}
            role="button"
            onClick={() =>
              this.setState(prevState => ({
                isExpanded: !prevState.isExpanded,
              }))
            }
            onKeyUp={() =>
              this.setState(prevState => ({
                isExpanded: !prevState.isExpanded,
              }))
            }
            tabIndex={0}
          >
            {this.state.isExpanded ? (
              <div>
                <FaMinus size={10} /> Hide All Variations
              </div>
            ) : (
              <div>
                <FaPlus size={10} /> Show All Variation
              </div>
            )}
          </div>
        </div>
        <div>{content}</div>
        <div
          className="ks-variation-demo__footer-region"
          style={{
            borderTopColor: colorTheme,
            display: this.state.isExpanded ? 'none' : 'block',
          }}
        >
          <details>
            <summary style={{ color: colorTheme }}>Data Used</summary>
            <pre style={{ color: colorTheme }}>
              <code>{JSON.stringify(this.props.data, null, '  ')}</code>
            </pre>
          </details>
        </div>
      </div>
    );
  }
}

VariationDemo.defaultProps = {
  data: {},
  isExpanded: false,
  color: 'component',
};

VariationDemo.propTypes = {
  templateId: PropTypes.string.isRequired,
  patternId: PropTypes.string.isRequired,
  data: PropTypes.object,
  // @todo cleanup api of `propKey` & `prop` - feels messy (but works!)
  propKey: PropTypes.string.isRequired,
  prop: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    enum: PropTypes.array,
  }).isRequired,
  isExpanded: PropTypes.bool,
  color: PropTypes.string,
};

export default function VariationDemos({
  schema,
  templateId,
  patternId,
  data,
  isExpanded,
}) {
  const variationsData = [];
  Object.keys(schema.properties).forEach(propKey => {
    const prop = schema.properties[propKey];
    if (prop.enum || prop.type === 'boolean') {
      variationsData.push({
        templateId,
        patternId,
        prop,
        propKey,
        data,
      });
    }
  });

  if (variationsData.length === 0) {
    return null;
  }

  const variations = variationsData.map(variationData => ({
    title: variationData.propKey,
    id: variationData.propKey,
    children: (
      <VariationDemo
        {...variationData}
        isExpanded={isExpanded}
        key={variationData.propKey}
      />
    ),
  }));

  return (
    <div className="ks-variation-demo">
      <h4>Variations</h4>
      <p>
        Explore the variations of each property of this component.
        <br />
        Use the radio buttons, or press &quot;Show All Variations&quot; to see
        all variations side by side.
      </p>
      <TabbedPanel color="component" bleed="0" items={variations} />
    </div>
  );
}

VariationDemos.defaultProps = {
  isExpanded: false,
};

VariationDemos.propTypes = {
  schema: PropTypes.object.isRequired,
  templateId: PropTypes.string.isRequired,
  patternId: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool,
};
