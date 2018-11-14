import React from 'react';
import Spinner from '@basalt/bedrock-spinner';
import { StatusMessage } from '@basalt/bedrock-atoms';
import { getDesignTokensCategories } from '../data';

/**
 *
 * @param {React.SFC} WrappedComponent
 * @return {React.ComponentClass}
 */
export default function makeDesignTokensPage(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        tokens: {},
        ready: false,
        errorMessage: '',
      };
    }

    componentDidMount() {
      getDesignTokensCategories(this.props.tokenCategories)
        .then(tokens => {
          if (tokens.ok) {
            this.setState({
              tokens: tokens.data,
              ready: true,
            });
          } else {
            this.setState({
              errorMessage: tokens.message,
              ready: true,
            });
          }
          return tokens.ok;
        })
        .catch(console.log.bind(console));
    }

    render() {
      if (!this.state.ready) {
        return <Spinner />;
      }
      if (this.state.errorMessage) {
        return <StatusMessage message={this.state.errorMessage} type="error" />;
      }
      return <WrappedComponent {...this.props} tokens={this.state.tokens} />;
    }
  };
}
