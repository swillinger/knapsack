import React from 'react';
import './form-icon-button.scss';

type DivTypes = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;

type Props = {
  active?: boolean;
  backgroundImage?: string;
  // onKeyPress?: func;
  // onClick?(event: React.MouseEvent<HTMLDivElement>): void;
  onClick?: DivTypes['onClick'];
  onKeyPress?: DivTypes['onKeyPress'];
  ariaLabel: string;
  tabIndex?: number;
};

export const FormIconButton: React.FC<Props> = ({
  active = false,
  ariaLabel,
  backgroundImage,
  onClick = () => {},
  onKeyPress = () => {},
  tabIndex = 0,
}: Props) => {
  return (
    <div
      className={`k-form-icon-button
        ${active ? 'k-form-icon-button--active' : ''}`}
      onKeyPress={onKeyPress}
      onClick={onClick}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      role="button"
    >
      {backgroundImage && (
        <div
          className="k-form-icon-button__icon"
          style={{
            background: `url(${backgroundImage})`,
          }}
        />
      )}
    </div>
  );
};
