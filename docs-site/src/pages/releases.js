import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import marked from 'marked';
import { getReleases } from '../utils';

export default function() {
  const [releases, setReleases] = useState([]);
  useEffect(() => {
    getReleases().then(setReleases);
  }, []);

  return (
    <Layout>
      <div>
        <h1>Releases</h1>
        <ul>
          {releases.map(release => (
            <li key={release.id}>
              <h4>
                <a href={release.html_url}>{release.name}</a>
              </h4>
              <div dangerouslySetInnerHTML={{ __html: marked(release.body) }} />
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
