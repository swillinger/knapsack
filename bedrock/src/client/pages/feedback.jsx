/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
import React from 'react';
import PageWithSidebar from '../layouts/page-with-sidebar';

/* eslint-disable */
const Feedback = props => (
  <PageWithSidebar {...props}>
    <script src="https://static.airtable.com/js/embed/embed_snippet_v1.js" />
    <iframe
      className="airtable-embed airtable-dynamic-height"
      src="https://airtable.com/embed/shrtDDM4DMDVT4uRT?backgroundColor=cyan"
      frameBorder="0"
      onmousewheel=""
      width="100%"
      height="818"
      css="background: transparent; border: 1px solid #ccc;"
    />
  </PageWithSidebar>
);

export default Feedback;
