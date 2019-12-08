import * as React from 'react';

type State = {
  hasError: boolean;
  componentStack?: string;
  error?: Error;
};

export default class ErrorCatcher extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State;

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      componentStack: '',
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const { componentStack } = errorInfo;
    this.setState({
      error,
      componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '5px',
          }}
        >
          <h5>Error caught in React Components</h5>
          {this.state.error?.name && (
            <h5>
              Error Name: <code>{this.state.error?.name}</code>
            </h5>
          )}
          {this.state.error?.message && (
            <h5>Message: {this.state.error?.message}</h5>
          )}
          {this.state.componentStack && (
            <>
              <h6>Component Stack:</h6>
              <pre>
                <code>{this.state.componentStack}</code>
              </pre>
              <br />
            </>
          )}
          {this.state.error?.stack && (
            <>
              <h6>Error Stack:</h6>
              <pre>
                <code>{this.state.error?.stack}</code>
              </pre>
            </>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
