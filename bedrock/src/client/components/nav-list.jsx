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
import { NavLink } from 'react-router-dom';
import { NavListStyled } from './nav-list.styles';

function NavList({ items }) {
  return (
    <NavListStyled>
      <ul className="nav-list">
        {items.map(({ title, isHeading, isSubHeading, id, path }) =>
          isHeading || isSubHeading ? (
            <li
              className={`nav-list__item nav-list__item--${
                isHeading ? 'heading' : 'subheading'
              }`}
              key={id}
            >
              <h4>{path ? <NavLink to={path}>{title}</NavLink> : title}</h4>
            </li>
          ) : (
            <li className="nav-list__item" key={id}>
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
