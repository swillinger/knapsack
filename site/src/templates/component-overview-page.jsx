import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PatternPage from '../templates/pattern-page';
import Overview from '../components/overview';
import Spinner from '../bedrock/components/spinner';
import { apiUrlBase } from '../../config';
import { VariationDemos } from '../bedrock/components/variation-demo';

class ComponentOverviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      ready: false,
    };
  }

  componentDidMount() {
    window
      .fetch(`${apiUrlBase}/pattern-info/components/${this.props.id}`)
      .then(res => res.json())
      .then(info => {
        if (info.ok) {
          this.setState({ info, ready: true });
        } else {
          // @todo Show error
          console.error('Uh oh, error!', info);
        }
      });
  }

  render() {
    let content;
    if (!this.state.ready) {
      content = <Spinner />;
    } else {
      const { template, schema } = this.state.info;
      content = (
        <article>
          <Overview
            template={template}
            schema={schema}
            demoSizes={this.props.demoSizes}
            data={this.props.data}
          />
          <hr />
          <VariationDemos
            schema={schema}
            template={template}
            data={this.props.data}
          />
        </article>
      );
    }
    return <PatternPage>{content}</PatternPage>;
  }
}

ComponentOverviewPage.defaultProps = {
  data: {},
  demoSizes: [],
};

ComponentOverviewPage.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.object,
  demoSizes: PropTypes.arrayOf(PropTypes.string.isRequired),
};

export default ComponentOverviewPage;
