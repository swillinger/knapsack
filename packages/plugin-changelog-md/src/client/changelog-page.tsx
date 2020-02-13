import React from 'react';
import marked from 'marked';
import { KsPluginPage, KsPluginPageProps } from '@knapsack/app/types';
import { Content } from '../types';

const ChangelogPage: KsPluginPage<Content> = (
  props: KsPluginPageProps<Content>,
) => {
  const { content } = props ?? {};

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: marked(
          content?.changelogContent ?? 'No *markdown* content loaded',
        ),
      }}
    />
  );
};

export default ChangelogPage;
