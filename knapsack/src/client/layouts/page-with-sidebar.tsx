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
import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FaChevronLeft } from 'react-icons/fa';
import ErrorCatcher from '../utils/error-catcher';
import Header from '../components/header';
import SecondaryNav from '../components/secondary-nav';
import Footer from '../components/footer';
import './page-with-sidebar.scss';

type Props = {
  isInitiallyCollapsed?: boolean;
  isFullScreen?: boolean;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
};

const PageWithSidebar: React.FC<Props> = ({
  isInitiallyCollapsed = false,
  sidebar,
  children,
  isFullScreen = false,
}: Props) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!isFullScreen) {
    return (
      <div
        className="page-with-sidebar"
        style={{
          gridTemplateColumns: isSidebarCollapsed ? '45px 1fr' : '300px 1fr',
        }}
      >
        <Header pathname={window.location.pathname} />
        <aside className="page-with-sidebar__sidebar">
          <div
            // className={` page-with-sidebar__sidebar__column ${isSidebarCollapsed ? 'page-with-sidebar__sidebar__column--collapsed' : ''}`}
            className={classnames({
              'page-with-sidebar__sidebar__column': true,
              'page-with-sidebar__sidebar__column--collapsed': isSidebarCollapsed,
            })}
          >
            {sidebar || <SecondaryNav pathname={window.location.pathname} />}
          </div>
          <button
            className="page-with-sidebar__sidebar__collapse-ctrl"
            type="button"
            onClick={() => setIsSidebarCollapsed(current => !current)}
          >
            <FaChevronLeft
              style={{
                marginTop: '50vh',
                transform: isSidebarCollapsed ? 'rotate(180deg)' : '',
              }}
            />
          </button>
        </aside>
        <ErrorCatcher>
          <main className="page-with-sidebar__page">{children}</main>
        </ErrorCatcher>
        <Footer />
      </div>
    );
  }
  return (
    <ErrorCatcher>
      <main>{children}</main>
    </ErrorCatcher>
  );
};

class PageWithSidebar2 extends Component {
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
    if (!this.props.isFullScreen) {
      return (
        <div
          className="page-with-sidebar"
          style={{
            gridTemplateColumns:
              sidebarCollapsed.toString() === 'true' ? '45px 1fr' : '300px 1fr',
          }}
        >
          <Header pathname={window.location.pathname} />
          <aside className="page-with-sidebar__sidebar">
            <div
              className={`
                page-with-sidebar__sidebar__column
                ${
                  sidebarCollapsed.toString() === 'true'
                    ? 'page-with-sidebar__sidebar__column--collapsed'
                    : ''
                }`}
            >
              {sidebar || <SecondaryNav pathname={window.location.pathname} />}
            </div>
            <button
              className="page-with-sidebar__sidebar__collapse-ctrl"
              type="button"
              onClick={this.handleSidebarToggle}
            >
              <FaChevronLeft
                style={{
                  marginTop: '50vh',
                  transform:
                    sidebarCollapsed.toString() === 'true'
                      ? 'rotate(180deg)'
                      : '',
                }}
              />
            </button>
          </aside>
          <ErrorCatcher>
            <main className="page-with-sidebar__page">{children}</main>
          </ErrorCatcher>
          <Footer />
        </div>
      );
    }
    return (
      <ErrorCatcher>
        <main>{children}</main>
      </ErrorCatcher>
    );
  }
}

PageWithSidebar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  isInitiallyCollapsed: PropTypes.bool,
  sidebar: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  isFullScreen: PropTypes.bool,
};

PageWithSidebar.defaultProps = {
  isInitiallyCollapsed: false,
  sidebar: null,
  children: <></>,
  isFullScreen: false,
};

export default PageWithSidebar;
