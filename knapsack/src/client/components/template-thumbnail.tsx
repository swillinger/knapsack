import React from 'react';
import Template, { Props as TemplateProps } from './template';
import './template-thumbnail.scss';

type Props = Omit<TemplateProps, 'isResizable'> & {
  renderedWidth: number;
  actualWidth: number;
  handleSelection?: () => void;
};

export const TemplateThumbnail: React.FC<Props> = ({
  renderedWidth,
  actualWidth,
  handleSelection = () => {},
  ...rest
}: Props) => {
  return (
    <div
      className="k-template-thumbnail"
      style={{
        width: `${actualWidth}px`,
      }}
    >
      <div
        className="k-template-thumbnail__template"
        style={{
          transform: `scale(${actualWidth / renderedWidth})`,
        }}
      >
        <Template {...rest} isResizable={false} />
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="k-template-thumbnail__overlay"
        onKeyPress={() => handleSelection()}
        onClick={() => handleSelection()}
      />
    </div>
  );
};
