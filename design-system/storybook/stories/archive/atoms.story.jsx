/* eslint-disable import/no-unresolved */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import {
  BlockQuoteWrapper,
  KsButton,
  KsDetails,
  KsSelect,
  StatusMessage,
  Tooltip,
} from '@knapsack/atoms';
import { paragraph } from '@basalt/demo-data';

storiesOf('Atoms', module)
  .add(
    'Select',
    withInfo({
      inline: true,
    })(() => (
      <KsSelect
        handleChange={action('option changed')}
        items={[
          {
            label: 'Option 1',
            value: 'option1',
          },
          {
            label: 'Option 2',
            value: 'option2',
          },
          {
            label: 'Option 3',
            value: 'option3',
          },
        ]}
      />
    )),
  )
  .add('Details', () => (
    <KsDetails titleContent="Details Content">{paragraph()}</KsDetails>
  ))
  .add('Button', () => <KsButton>Test Button</KsButton>)
  .add(
    'StatusMessage',
    withInfo({
      inline: true,
    })(() => (
      <div>
        <StatusMessage type="info" message={paragraph()} />
        <StatusMessage type="success" message={paragraph()} />
        <StatusMessage type="warning" message={paragraph()} />
        <StatusMessage type="error" message={paragraph()} />
      </div>
    )),
  )
  .add('Blockquote Wrapper', () => (
    <BlockQuoteWrapper>
      It’s art if can’t be explained. It’s fashion if no one asks for an
      explanation. It’s design if it doesn’t need explanation.
      <footer>Wouter Stokkel</footer>
    </BlockQuoteWrapper>
  ))
  .add(
    'Tool Tip',
    withInfo({ inline: true })(() => (
      <Tooltip tooltipContent="This is tooltip content!!" position="right">
        <p>Hover Here</p>
      </Tooltip>
    )),
  );
