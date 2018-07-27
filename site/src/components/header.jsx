import React from 'react';
import Link from 'gatsby-link'; // eslint-disable-line
import PropTypes from 'prop-types';

import basalt from '../../../images/logos/white-grey.svg';
import './header.css';

const Header = ({ siteTitle }) => (
  <nav className="site-header">
    <div className="site-header__brand">
      <h3 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>
      </h3>
    </div>
    <div>
      {/* @todo clean this up; propagate these classnames */}
      <ul className="site-header__nav">
        <li className="site-header__item">
          <Link
            className="site-header__link"
            to="/docs"
            style={{
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Getting Started
          </Link>
        </li>
        <li>
          <Link
            to="/visual-language"
            style={{
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Visual Language
          </Link>
        </li>
        <li>
          <Link
            to="/patterns"
            style={{
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Patterns
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            style={{
              color: 'white',
              textDecoration: 'none',
            }}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/resources"
            style={{
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Resources
          </Link>
        </li>
        <li>
          <a
            href="http://www.basalt.io"
            style={{
              color: 'white',
              textDecoration: 'none',
            }}
          >
            <img src={basalt} alt="Basalt" style={{ height: '1rem' }} />
          </a>
        </li>
      </ul>
    </div>
  </nav>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: 'Site Title',
};

export default Header;