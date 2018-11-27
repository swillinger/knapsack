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
