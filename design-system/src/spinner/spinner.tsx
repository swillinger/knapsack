import * as React from 'react';
import './spinner.scss';

export interface SpinnerProps {
  text?: string;
  error?: string;
}

export const Spinner: React.FC<SpinnerProps> = (props: SpinnerProps) => {
  if (props.error) {
    // used by `react-loadable`
    throw new Error(props.error);
  }
  return (
    <div className="k-spinner">
      <br />
      <div className="k-spinner__core">
        <div className="k-spinner__cube-one" />
        {/* @todo the added styles below are for a bug introduced in v4 of sytled components */}
        <div
          className="k-spinner__cube-two"
          style={{ animationDelay: '-0.9s' }}
        />
      </div>
      <br />
      {props.text && <h2>{props.text}</h2>}
    </div>
  );
};
