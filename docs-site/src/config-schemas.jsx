/**
 *  Copyright (C) 2018 Basalt
 This file is part of Knapsack.
 Knapsack is free software; you can redistribute it and/or modify it
 under the terms of the GNU General Public License as published by the Free
 Software Foundation; either version 2 of the License, or (at your option)
 any later version.

 Knapsack is distributed in the hope that it will be useful, but WITHOUT
 ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 more details.

 You should have received a copy of the GNU General Public License along
 with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import React from 'react';
import SchemaTable from '@knapsack/schema-table';
import designTokens from '@basalt/knapsack/src/schemas/knapsack-design-tokens.schema';
// import settings from '@basalt/knapsack/src/schemas/knapsack.settings.schema';
// import patternMeta from '@basalt/knapsack/src/schemas/pattern-meta.schema';
// import patternWithMeta from '@basalt/knapsack/src/schemas/pattern-w-meta.schema';
import patternFull from '@basalt/knapsack/src/schemas/pattern.schema';

// const patternTemplates = require('@basalt/knapsack/src/schemas/pattern-templates.schema.js');

const ConfigSchemas = () => (
  <div className="post">
    <header className="postHeader">
      <h1>Config Schemas</h1>
    </header>
    <h2>{patternFull.title}</h2>
    <SchemaTable schema={patternFull} />

    {/* @todo fix, having `Cannot read property 'title' of undefined` errors */}
    <h2>{designTokens.knapsackDesignTokenSchema.title}</h2>
    <SchemaTable schema={designTokens.knapsackDesignTokenSchema} />
  </div>
);

export default ConfigSchemas;
