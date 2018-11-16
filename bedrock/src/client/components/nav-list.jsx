import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NavListStyled } from './nav-list.styles';

function NavList({ items }) {
  return (
    <NavListStyled>
      <ul>
        {items.map(({ title, isHeading, id, path }) =>
          isHeading ? (
            <li key={id}>
              <h4>{path ? <NavLink to={path}>{title}</NavLink> : title}</h4>
            </li>
          ) : (
            <li key={id}>
              <NavLink to={path} exact>
                {title}
              </NavLink>
            </li>
          ),
        )}
      </ul>
    </NavListStyled>
  );
}

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
