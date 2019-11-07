import React from 'react';
import { KnapsackDesignToken } from '@knapsack/core';
import { DeviceWidth, commonWidths } from './device-widths';
import './breakpoints-demo.scss';

type GeneralProps = {
  items: KnapsackDesignToken[];
};

type Props = {
  tokens: KnapsackDesignToken[];
};

const BreakpointList: React.FC<GeneralProps> = ({ items }: GeneralProps) => {
  return (
    <ul className="breakpoints">
      {items.map(item => (
        <li
          className="breakpoints-demo__breakpoint-item"
          key={item.name}
          style={{
            left: item.value,
          }}
        >
          <span className="label">
            {item.name}:<br />
            {item.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

const DeviceWidthList: React.FC<{ items: DeviceWidth[] }> = ({
  items,
}: {
  items: DeviceWidth[];
}) => {
  return (
    <ul className="breakpoints-demo__device-width-list">
      {items.map(item => (
        <li
          className="breakpoints-demo__device-item"
          key={item.name}
          style={{
            width: item.width,
          }}
        >
          <span className="label">
            {item.name}: {item.width}
          </span>
        </li>
      ))}
    </ul>
  );
};

export const BreakpointsDemo: React.FC<Props> = ({ tokens }: Props) => (
  <div className="breakpoints-demo__breakpoint-list">
    <BreakpointList items={tokens} />
    <DeviceWidthList items={commonWidths} />
  </div>
);
