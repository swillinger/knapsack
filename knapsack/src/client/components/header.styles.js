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
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';

export const SiteHeaderLink = styled(Link)`
  && {
    color: white;
    text-decoration: none;
  }
`;

export const SiteHeaderNavLink = styled(NavLink)`
  && {
    color: white;
    text-decoration: none;
  }
`;

export const Hamburger = styled(FaBars)`
  color: white;
  float: right;
  font-size: 1.5rem;
`;

export const X = styled(FaTimes)`
  color: white;
  float: right;
  font-size: 1.5rem;
`;

export const SiteHeaderLogo = styled.img`
  height: 30px;
  margin-right: 1.25rem;
  width: auto;
  @media screen and (min-width: 450px) {
    height: 38px;
    margin-right: 1.5rem;
  }
`;
