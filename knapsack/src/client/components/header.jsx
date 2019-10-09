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
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import {
  SiteHeaderLink,
  Hamburger,
  SiteHeaderNavLink,
  SiteHeaderLogo,
  X,
} from './header.styles';
import { BASE_PATHS } from '../../lib/constants';
import knapsackLogo from '../assets/knapsack-logo-trans.svg';
import './header.scss';

const headerQuery = gql`
  {
    settings {
      title
      parentBrand {
        homepage
        title
        logo
      }
      customSections {
        id
        title
        showInMainMenu
        pages {
          id
          title
        }
      }
    }
    pageBuilderPages {
      id
    }
    patterns {
      id
    }
    docs {
      id
      data {
        title
      }
    }
  }
`;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      mobileNavVisible: false,
    };
    this.handleNavClick = this.handleNavClick.bind(this);
    this.renderNavigation = this.renderNavigation.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  /* eslint-disable */
  componentDidUpdate(prevProps) {
    if (this.props.pathname !== prevProps.pathname) {
      this.setState({ mobileNavVisible: false });
    }
  }

  /* eslint-enable */

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    this.setState({ windowWidth: window.innerWidth });
  }

  handleNavClick() {
    this.setState(prevState => ({
      mobileNavVisible: !prevState.mobileNavVisible,
    }));
  }

  // @todo refactor
  static renderLinks({ settings: { parentBrand, customSections = [] }, docs }) {
    return (
      <ul>
        <li>
          <SiteHeaderNavLink to={`${BASE_PATHS.PATTERNS}/all`}>
            Patterns
          </SiteHeaderNavLink>
        </li>
        <li>
          <SiteHeaderNavLink to={BASE_PATHS.PAGES}>
            Page Builder
          </SiteHeaderNavLink>
        </li>
        {docs.length > 0 && (
          <li>
            <SiteHeaderNavLink to={`${BASE_PATHS.DOCS}/${docs[0].id}`}>
              Docs
            </SiteHeaderNavLink>
          </li>
        )}
        <li>
          <SiteHeaderNavLink to={BASE_PATHS.GRAPHIQL_PLAYGROUND}>
            API
          </SiteHeaderNavLink>
        </li>
        {/* @todo Reimplement header nav for custom sections once implemented with gql */}
        {customSections &&
          customSections.length > 0 &&
          customSections
            .filter(section => section.showInMainMenu)
            .map(section => {
              if (section.pages.length === 0) return null;
              const [firstPage] = section.pages;
              const path = `/${section.id}/${firstPage.id}`;
              // For each section, we'll use the section title, but link to the first page in that section
              return (
                <li key={path}>
                  <SiteHeaderNavLink to={path}>
                    {section.title}
                  </SiteHeaderNavLink>
                </li>
              );
            })}
        {parentBrand.title && parentBrand.homepage && (
          <li>
            <a
              href={parentBrand.homepage}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'white',
                textDecoration: 'none',
              }}
            >
              {(parentBrand.logo && (
                <img
                  src={parentBrand.logo}
                  alt={parentBrand.title}
                  style={{ height: '1rem' }}
                />
              )) ||
                parentBrand.title}
            </a>
          </li>
        )}
      </ul>
    );
  }

  renderNavigation(data) {
    // If Mobile
    if (this.state.windowWidth <= 950) {
      return this.state.mobileNavVisible ? (
        <div className="header__mobile-nav">
          {Header.renderLinks(data)}
          <X onClick={this.handleNavClick} />
        </div>
      ) : (
        <Hamburger onClick={this.handleNavClick} />
      );
    }
    // If Desktop
    return Header.renderLinks(data);
  }

  render() {
    return (
      <Query query={headerQuery}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          return (
            <div className="header">
              <h3 style={{ margin: 0 }}>
                <SiteHeaderLogo src={knapsackLogo} alt="Knapsack" />
                <SiteHeaderLink to="/">{data.settings.title}</SiteHeaderLink>
              </h3>
              {this.renderNavigation(data)}
            </div>
          );
        }}
      </Query>
    );
  }
}

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default Header;
