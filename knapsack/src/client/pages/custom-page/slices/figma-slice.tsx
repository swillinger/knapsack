import React from 'react';
import { KsButton, Icon } from '@knapsack/design-system';
import url from 'url';
import { Slice } from './types';

type Data = {
  figmaFileUrl?: string;
  height?: number;
};

export const figmaSlice: Slice<Data> = {
  id: 'figma-slice',
  title: 'Figma',
  render: props => {
    const { figmaFileUrl, height = 500 } = props?.data ?? {};
    if (!figmaFileUrl) {
      return (
        <>
          <h3>Figma Embed</h3>
          <p>Getting Started:</p>
          <ol>
            <li>Open Figma, click Share</li>
            <li>Copy link (not embed code)</li>
            <li>Click edit icon above and paste in link</li>
          </ol>
        </>
      );
    }

    const { host } = url.parse(figmaFileUrl, true);
    if (host !== 'www.figma.com') {
      throw new Error(
        `Provided url needs to be for Figma.com, received "${figmaFileUrl}"`,
      );
    }
    const src = url.format({
      protocol: 'https',
      hostname: 'www.figma.com',
      pathname: '/embed',
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        embed_host: 'share',
        url: figmaFileUrl,
      },
    });
    return (
      <div>
        <iframe
          src={src}
          width="100%"
          height={height}
          allowFullScreen
          title="Figma"
        />
        <KsButton
          size="s"
          handleTrigger={() => window.open(figmaFileUrl, '_blank')}
        >
          View Figma File
        </KsButton>
      </div>
    );
  },
  schema: {
    type: 'object',
    required: ['figmaFileUrl'],
    properties: {
      figmaFileUrl: {
        title: 'Figma File Url',
        description: 'Link to Figma file from share url (not embed code)',
        type: 'string',
      },
      height: {
        type: 'number',
        default: 500,
      },
    },
  },
};
