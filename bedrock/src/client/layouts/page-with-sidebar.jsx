import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
      <PageLayoutWithSidebar sidebarCollapsed={sidebarCollapsed}>
        <Header pathname={pathname} />
        <SidebarStyled sidebarCollapsed={sidebarCollapsed}>
          <SidebarColumn sidebarCollapsed={sidebarCollapsed}>
            {sidebar || <SecondaryNav pathname={pathname} />}
          </SidebarColumn>
          <SidebarTrayHandle onClick={this.handleSidebarToggle}>
            <ToggleChevron sidebarcollapsed={sidebarCollapsed.toString()} />
          </SidebarTrayHandle>
        </SidebarStyled>
        <main>{children}</main>
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
