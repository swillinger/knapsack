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
import styled from 'styled-components';

export const NavListStyled = styled.nav`
  li {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    position: relative;
  }
  .nav-list__item--heading {
    h4 {
      margin-top: 1.5rem;
    }
  }
  .nav-list__item--subheading {
    h4 {
      font-size: 80%;
      margin-left: 10px;
      margin-top: 0.75rem;
    }
  }
  .nav-list__item--heading + .nav-list__item--subheading > h4 {
    margin-top: 0;
  }
  .nav-list__item--heading:first-child {
    h4 {
      margin-top: 0.5rem;
    }
  }
  h4 {
    text-decoration: none;
    a {
      margin-left: 0;
    }
    a[aria-current='page'] {
      font-weight: bold;
      &:before {
        color: ${props => props.theme.sidebar.accentColor};
        content: '>';
        position: absolute;
        left: -20px;
      }
    }
  }
  a {
    text-decoration: none;
    margin-left: 20px;
    &:hover {
      text-decoration: underline;
    }
    &[aria-current='page'] {
      font-weight: bold;
      &:before {
        color: ${props => props.theme.sidebar.accentColor};
        content: '>';
        position: absolute;
        left: 0;
      }
    }
  }
`;
