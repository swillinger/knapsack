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
import PropTypes from 'prop-types';
import Header from '../components/header';
import Footer from '../components/footer';
import ErrorCatcher from '../utils/error-catcher';
import { PageLayoutWithoutSidebar } from './page-without-sidebar.styles';

function PageWithoutSidebar({ children, ...rest }) {
  return (
    <PageLayoutWithoutSidebar>
      <Header {...rest} />
      <ErrorCatcher>{children}</ErrorCatcher>
      <Footer />
    </PageLayoutWithoutSidebar>
  );
}

PageWithoutSidebar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default PageWithoutSidebar;
