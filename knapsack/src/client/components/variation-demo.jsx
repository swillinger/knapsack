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
import SchemaForm from '@basalt/knapsack-schema-form';
import TabbedPanel from '@basalt/knapsack-tabbed-panel';
import { Checkerboard } from '@basalt/knapsack-atoms';
import { getTypeColor } from '@basalt/knapsack-core';
import Template from './template';
import {
  VariationsWrapper,
  FooterRegion,
  HeaderInner,
  HeaderRegion,
  VariationItem,
  VariationItemExpanded,
} from './variation-demo.styles';

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
      data: Object.assign({}, prevState.data, data.formData),
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
        const itemData = Object.assign({}, this.props.data, {
          [propKey]: item,
        });
        return (
          <VariationItemExpanded
            key={JSON.stringify(itemData)}
            colorTheme={colorTheme}
          >
            <h4>
              <code>{propKey}</code>:{' '}
              <code>
                {typeof item === 'boolean' ? JSON.stringify(item) : item}
              </code>
            </h4>
            <Checkerboard bleed="20px">
              <Template
                templateId={this.props.templateId}
                patternId={this.props.patternId}
                data={itemData}
              />
            </Checkerboard>
          </VariationItemExpanded>
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
          <VariationItem colorTheme={colorTheme}>
            <SchemaForm
              schema={formSchema}
              onChange={this.handleChange}
              formData={this.state.data}
              isInline
              uiSchema={formUi}
            />
          </VariationItem>
          <Checkerboard bleed="20px">
            <Template
              templateId={this.props.templateId}
              patternId={this.props.patternId}
              showDataUsed={false}
              data={this.state.data}
            />
          </Checkerboard>
        </div>
      );
    }

    return (
      <div>
        <HeaderRegion
          colorTheme={colorTheme}
          colorThemeAccent={colorThemeAccent}
        >
          {prop.description && (
            <div>
              <h5>Description</h5>
              <p>{prop.description}</p>
            </div>
          )}
          <HeaderInner
            colorTheme={colorTheme}
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
          </HeaderInner>
        </HeaderRegion>
        <div>{content}</div>
        <FooterRegion
          colorTheme={colorTheme}
          style={{
            display: this.state.isExpanded ? 'none' : 'block',
          }}
        >
          <details>
            <summary>Data Used</summary>
            <pre>
              <code>{JSON.stringify(this.props.data, null, '  ')}</code>
            </pre>
          </details>
        </FooterRegion>
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
    <VariationsWrapper>
      <h4>Variations</h4>
      <p>
        Explore the variations of each property of this component.
        <br />
        Use the radio buttons, or press &quot;Show All Variations&quot; to see
        all variations side by side.
      </p>
      <TabbedPanel color="component" bleed="0" items={variations} />
    </VariationsWrapper>
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
