import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { PageLayoutWithoutSidebar } from './page-without-sidebar.styles';

function PageWithoutSidebar({ children, ...rest }) {
  return (
    <PageLayoutWithoutSidebar>
      <Header {...rest} />
      {children}
      <Footer />
    </PageLayoutWithoutSidebar>
  );
}

PageWithoutSidebar.propTypes = {};

export default PageWithoutSidebar;
