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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorCatcher from '../utils/error-catcher';
import Header from '../components/header';
import SecondaryNav from '../components/secondary-nav';
import Footer from '../components/footer';
import {
  PageLayoutWithSidebar,
  SidebarColumn,
  SidebarStyled,
  SidebarTrayHandle,
  ToggleChevron,
} from './page-with-sidebar.styles';

class PageWithSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarCollapsed: props.isInitiallyCollapsed,
    };
    this.handleSidebarToggle = this.handleSidebarToggle.bind(this);
  }

  handleSidebarToggle() {
    this.setState(prevState => ({
      sidebarCollapsed: !prevState.sidebarCollapsed,
    }));
  }

  render() {
    const { children, sidebar = null } = this.props;
    const { sidebarCollapsed } = this.state;
    const pathname =
      (this.props.location && this.props.location.pathname) || this.props.path;
    return (
      <PageLayoutWithSidebar sidebarCollapsed={sidebarCollapsed.toString()}>
        <Header pathname={pathname} />
        <SidebarStyled sidebarCollapsed={sidebarCollapsed.toString()}>
          <SidebarColumn sidebarCollapsed={sidebarCollapsed.toString()}>
            {sidebar || <SecondaryNav pathname={pathname} />}
          </SidebarColumn>
          <SidebarTrayHandle onClick={this.handleSidebarToggle}>
            <ToggleChevron sidebarcollapsed={sidebarCollapsed.toString()} />
          </SidebarTrayHandle>
        </SidebarStyled>
        <ErrorCatcher>
          <main>{children}</main>
        </ErrorCatcher>
        <Footer />
      </PageLayoutWithSidebar>
    );
  }
}

PageWithSidebar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  isInitiallyCollapsed: PropTypes.bool,
  location: PropTypes.object,
  path: PropTypes.string,
  sidebar: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

PageWithSidebar.defaultProps = {
  isInitiallyCollapsed: false,
  location: null,
  path: null,
  sidebar: null,
  children: <></>,
};

export default PageWithSidebar;
