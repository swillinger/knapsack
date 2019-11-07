import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './clear-filter-button.scss';

type DivTag = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;

type Props = {
  isVisible: boolean;
  onClick?: DivTag['onClick'];
  onKeyPress?: DivTag['onKeyPress'];
};

export const ClearFilterButton: React.FC<Props> = ({
  onKeyPress = () => {},
  onClick = () => {},
  isVisible = false,
}: Props) => {
  return (
    <div
      className="k-clear-filter-button"
      style={{
        display: isVisible ? 'flex' : 'none',
      }}
      onClick={onClick}
      onKeyPress={onKeyPress}
      role="button"
      tabIndex={0}
    >
      <FaTimes />
    </div>
  );
};
