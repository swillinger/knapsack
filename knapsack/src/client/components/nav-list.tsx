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
import { NavLink } from 'react-router-dom';
import { PatternStatusIcon } from '@knapsack/design-system';
import { PropTypesToTsType } from '@knapsack/utils';
import './nav-list.scss';

const propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      isHeading: PropTypes.bool,
      isSubHeading: PropTypes.bool,
      status: PropTypes.shape({
        color: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
      }),
    }),
  ).isRequired,
};

export type Props = PropTypesToTsType<typeof propTypes>;

export const NavList: React.FC<Props> = ({ items }: Props) => {
  return (
    <nav className="ks-pattern-nav-list">
      <ul>
        {items.map(
          ({ title, isHeading, isSubHeading, id, path, status = null }) =>
            isHeading || isSubHeading ? (
              <li
                className={`ks-pattern-nav-list__item ks-pattern-nav-list__item--${
                  isHeading ? 'heading' : 'subheading'
                }`}
                key={id + path}
              >
                <h4>{path ? <NavLink to={path}>{title}</NavLink> : title}</h4>
              </li>
            ) : (
              <li className="ks-pattern-nav-list__item" key={id + path}>
                <NavLink to={path} exact>
                  {title}
                  {status && (
                    <PatternStatusIcon
                      color={status.color}
                      title={status.title}
                    />
                  )}
                </NavLink>
              </li>
            ),
        )}
      </ul>
    </nav>
  );
};
