import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SchemaForm from './schema-form';
import Twig from './twig';

class VariationDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      expanded: props.expanded,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {}

  handleChange(data) {
    this.setState({
      data: Object.assign({}, this.state.data, data.formData),
    });
  }

  render() {
    console.log({
      props: this.props,
      state: this.state,
    });
    const { prop, propKey } = this.props;
    const formSchema = {
      type: 'object',
      properties: {
        [propKey]: prop,
      },
    };

    let content;
    if (this.state.expanded) {
      content = prop.enum.map(item => {
        const itemData = Object.assign({}, this.props.data, {
          [propKey]: item,
        });
        return (
          <div>
            <h4>
              <code>{propKey}</code>: <code>{item}</code>
            </h4>
            <Twig template={this.props.template} data={itemData} />
          </div>
        );
      });
    } else {
      content = (
        <div>
          <SchemaForm
            schema={formSchema}
            onChange={this.handleChange}
            formData={this.state.data}
            inline
          />
          <Twig template={this.props.template} data={this.state.data} />
        </div>
      );
    }

    return (
      <div
        style={{
          border: 'dotted blue 1px',
          padding: '5px',
          margin: '5px',
        }}
      >
        <h4>Title: {prop.title}</h4>
        <p>Description: {prop.description}</p>
        <button
          onClick={() => this.setState({ expanded: !this.state.expanded })}
        >
          Toggle Expand/Contract
        </button>
        <div>{content}</div>
      </div>
    );
  }
}

VariationDemo.defaultProps = {
  data: {},
  expanded: false,
};

VariationDemo.propTypes = {
  template: PropTypes.string.isRequired,
  data: PropTypes.object,
  // @todo cleanup api of `propKey` & `prop` - feels messy (but works!)
  propKey: PropTypes.string.isRequired,
  prop: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    enum: PropTypes.array.isRequired,
  }).isRequired,
  expanded: PropTypes.bool,
};

export default VariationDemo;

export const VariationDemoes = ({ schema, template, data, expanded }) => {
  const variationsData = [];
  Object.keys(schema.properties).forEach(propKey => {
    const prop = schema.properties[propKey];
    if (prop.enum) {
      variationsData.push({
        template,
        prop,
        propKey,
        data,
      });
    }
  });

  const variations = variationsData.map(variationData => (
    <VariationDemo {...variationData} expanded={expanded} />
  ));

  return (
    <div>
      <h4>Variations</h4>
      <div>{variations}</div>
      <hr />
    </div>
  );
};

VariationDemoes.defaultProps = {
  expanded: false,
};

VariationDemoes.propTypes = {
  schema: PropTypes.object.isRequired,
  template: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  expanded: PropTypes.bool,
};