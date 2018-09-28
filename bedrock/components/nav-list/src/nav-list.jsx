import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NavListStyled } from './nav-list.styles';

const NavList = ({ items }) => (
  <NavListStyled>
    <ul>
      {items.map(item => {
        const { title, isHeading, id, path } = item;
        if (isHeading) {
          return (
            <li key={id}>
              <h4>
                {path && <NavLink to={path}>{title}</NavLink>}
                {!path && title}
              </h4>
            </li>
          );
        }
        return (
          <li key={id}>
            <NavLink to={path} exact>
              {title}
            </NavLink>
          </li>
        );
      })}
    </ul>
  </NavListStyled>
);

NavList.defaultProps = {};

NavList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default NavList;
