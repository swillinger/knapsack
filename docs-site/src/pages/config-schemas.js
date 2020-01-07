import React from 'react';
import Layout from '@theme/Layout';

import { SchemaTable } from '@knapsack/design-system';
// import settings from '@knapsack/app/src/schemas/knapsack.settings.schema';
// import patternMeta from '@knapsack/app/src/schemas/pattern-meta.schema';
// import patternWithMeta from '@knapsack/app/src/schemas/pattern-w-meta.schema';
import patternSchema from '@knapsack/app/src/json-schemas/schemaKnapsackPattern';
// import schemaKnapsackAssetSetsConfig from '@knapsack/app/src/json-schemas/schemaKnapsackAssetSetsConfig.json';
import schemaKnapsackNavsConfig from '@knapsack/app/src/json-schemas/schemaKnapsackNavsConfig.json';

// const patternTemplates = require('@knapsack/app/src/schemas/pattern-templates.schema.js');

export default () => (
  <Layout>
    <h1>Configuration File Schemas</h1>
    <h2>
      <code>knapsack.pattern.*.json</code>
    </h2>
    <SchemaTable schema={patternSchema} />
    <hr />
    {/*
    <h2>
      <code>knapsack.asset-sets.json</code>
    </h2>
    <SchemaTable schema={schemaKnapsackAssetSetsConfig} />
    <hr /> */}

    <h2>
      <code>knapsack.navs.json</code>
    </h2>
    <SchemaTable schema={schemaKnapsackNavsConfig} />
    <hr />
  </Layout>
);
