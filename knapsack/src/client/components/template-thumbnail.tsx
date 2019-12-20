import React from 'react';
import Template, { Props as TemplateProps } from './template';
import './template-thumbnail.scss';

type Props = Omit<TemplateProps, 'isResizable'> & {
  handleSelection?: () => void;
  /**
   * The width in pixels that the pattern prefers to be demoed at; a button might be 150, a card 450, and a hero 1100
   */
  patternWidth?: number;
};

export const TemplateThumbnail: React.FC<Props> = ({
  handleSelection = () => {},
  patternWidth = 400,
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
