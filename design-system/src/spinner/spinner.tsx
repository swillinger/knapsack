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

export interface CircleSpinnerProps {
  size?: string;
  error?: string;
}

export const CircleSpinner: React.FC<CircleSpinnerProps> = ({
  size = '1em',
  error,
}: CircleSpinnerProps) => {
  if (error) {
    // used by `react-loadable`
    throw new Error(error);
  }
  return (
    <span className="k-circle-spinner" style={{ width: size, height: size }}>
      <span className="k-circle-spinner__inner">
        <span className="k-circle-spinner__inner-animation">
          <svg
            width={size}
            height={size}
            strokeWidth="16.00"
            viewBox="-3.00 -3.00 106.00 106.00"
          >
            <path
              className="k-circle-spinner__inner-track"
              d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90"
            />
            <path
              className="k-circle-spinner__inner-head"
              d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90"
              pathLength="280"
              strokeDasharray="280 280"
              strokeDashoffset="210"
            />
          </svg>
        </span>
      </span>
    </span>
  );
};
