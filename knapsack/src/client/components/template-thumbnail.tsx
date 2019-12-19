import React from 'react';
import Template, { Props as TemplateProps } from './template';
import './template-thumbnail.scss';

type Props = Omit<TemplateProps, 'isResizable'> & {
  handleSelection?: () => void;
};

export const TemplateThumbnail: React.FC<Props> = ({
  handleSelection = () => {},
  ...rest
}: Props) => {
  return (
    <div className="ks-template-thumbnail">
      <div
        className="ks-template-thumbnail__template"
        // GET DEMO'S ACTUAL WIDTH
        // style={{
        //   transform: `scale(calc(var(--demo-item-size) / ${demoWidth}))`,
        // }}
      >
        <Template {...rest} isResizable={false} />
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="ks-template-thumbnail__overlay"
        onKeyPress={() => handleSelection()}
        onClick={() => handleSelection()}
      />
    </div>
  );
};
