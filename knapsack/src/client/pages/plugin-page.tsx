import React, { useState, useEffect, Suspense } from 'react';
import { CircleSpinner } from '@knapsack/design-system';
import { KsClientPlugin, KsPluginPageConfig } from '../../types';
import { getPluginContent } from '../data';
import { useSelector } from '../store';
import PageWithSidebar from '../layouts/page-with-sidebar';

type Props = {
  plugin: KsClientPlugin<any>;
  page: KsPluginPageConfig<any>;
};

const PluginPage: React.FC<Props> = ({ plugin, page }: Props) => {
  const pluginMeta = useSelector(s =>
    s.metaState.plugins.find(p => p.id === plugin.id),
  );
  const { Page } = page;
  const [content, setContent] = useState();

  useEffect(() => {
    if (plugin.id === 'ks-cloud') return; // @todo make ks-cloud real plugin
    if (!pluginMeta.hasContent) return;
    getPluginContent({
      pluginId: plugin.id,
    }).then(({ ok, payload, message }) => {
      if (!ok) {
        const msg = `Uh oh! Error when getting plugin "${plugin.id}" content: ${message}`;
        console.error(msg);
        throw new Error(msg);
      }
      setContent(payload);
    });
  }, [plugin?.id]);

  return (
    <PageWithSidebar title={page.title} section={page.section}>
      <Suspense fallback={<CircleSpinner />}>
        <Page content={content} />
      </Suspense>
    </PageWithSidebar>
  );
};

export default PluginPage;
