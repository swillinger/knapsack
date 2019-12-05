import React from 'react';
import { KnapsackDesignToken } from '@knapsack/core/dist/types';
import { TypographyChildrenDemoWrapper } from './shared/typography-children-demo-wrapper';

type Props = {
  tokens: KnapsackDesignToken[];
};

export const FontWeightDemo: React.FC<Props> = ({ tokens }: Props) => {
  if (!tokens) return null;
  const demos = tokens.map(token => (
    <TypographyChildrenDemoWrapper key={token.name} fontWeight={token.value}>
      <code>{token.name}</code>: {token.value} <br />
      <p suppressContentEditableWarning>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    </TypographyChildrenDemoWrapper>
  ));

  return <div>{demos}</div>;
};
