import React from 'react';
import { KnapsackDesignToken } from '@knapsack/core';
import { TypographyChildrenDemoWrapper } from './shared/typography-children-demo-wrapper';

type Props = {
  tokens: KnapsackDesignToken[];
};

export const FontFamilyDemo: React.FC<Props> = ({ tokens }: Props) => {
  if (!tokens) return null;
  const demos = tokens.map(token => (
    <TypographyChildrenDemoWrapper key={token.name} fontFamily={token.value}>
      <code>{token.name}</code>: {token.value} <br />
      <blockquote contentEditable suppressContentEditableWarning>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </blockquote>
    </TypographyChildrenDemoWrapper>
  ));

  return <div>{demos}</div>;
};
