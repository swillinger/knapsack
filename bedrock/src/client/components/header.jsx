import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import {
  SiteHeaderLink,
  Hamburger,
  MobileNav,
  SiteHeaderNavLink,
  SiteNav,
  X,
} from './header.styles';
import { BASE_PATHS } from '../../lib/constants';

const headerQuery = gql`
  {
    settings {
      title
      parentBrand {
        homepage
        title
        logo
      }
    }
    examples {
      id
    }
    patterns {
      id
    }
    tokenGroups {
      id
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
    if (this.props.location.pathname !== prevProps.location.pathname) {
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
  static renderLinks({ settings }) {
    return (
      <ul>
        <li>
          <SiteHeaderNavLink to={BASE_PATHS.DESIGN_TOKENS}>
            Design Tokens
          </SiteHeaderNavLink>
        </li>
        <li>
          <SiteHeaderNavLink to={BASE_PATHS.PATTERNS}>
            Patterns
          </SiteHeaderNavLink>
        </li>
        <li>
          <SiteHeaderNavLink to={BASE_PATHS.PAGES}>
            Page Builder
          </SiteHeaderNavLink>
        </li>
        {/* @todo Reimplement header nav for custom sections once implemented with gql */}
        {/* {sections.map(section => ( */}
        {/* <li key={section.id}> */}
        {/* <SiteHeaderNavLink to={section.items[0].path}> */}
        {/* {section.title} */}
        {/* </SiteHeaderNavLink> */}
        {/* </li> */}
        {/* ))} */}
        {settings.parentBrand && (
          <li>
            <a
              href={settings.parentBrand.homepage}
              style={{
                color: 'white',
                textDecoration: 'none',
              }}
            >
              {(settings.parentBrand.logo && (
                <img
                  src={settings.parentBrand.logo}
                  alt={settings.parentBrand.title}
                  style={{ height: '1rem' }}
                />
              )) ||
                settings.parentBrand.title}
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
        <MobileNav>
          {Header.renderLinks(data)}
          <X onClick={this.handleNavClick} />
        </MobileNav>
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
            <SiteNav>
              <h3 style={{ margin: 0 }}>
                <SiteHeaderLink to="/">{data.settings.title}</SiteHeaderLink>
              </h3>
              {this.renderNavigation(data)}
            </SiteNav>
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
