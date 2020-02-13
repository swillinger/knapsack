import { useEffect } from 'react';
// import Layout from '@theme/Layout';

function Hello() {
  useEffect(() => {
    window.location.pathname = '/docs/intro/overview';
  }, []);
  return null;
}
export default Hello;
