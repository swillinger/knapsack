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
import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  padding: 1.5rem;
  border-top: 1px solid #000000;
  background-color: ${props => props.theme.footer.background};
  color: white;
  @media (max-width: 649px) {
    padding: 1rem;
  }
  p,
  && a {
    color: white;
  }
  ul,
  li {
    margin-bottom: 2px;
  }
`;

export const FooterInner = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 649px) {
    flex-direction: column;
  }
`;

export const FooterMenu = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  @media (max-width: 649px) {
    display: block;
    text-align: center;
  }
`;

export const FooterMenuItem = styled.li`
  display: inline-block;
  & + li {
    margin-left: 1.5rem;
  }
  a:link,
  a:visited {
    text-decoration: underline;
  }
  a:hover {
    text-decoration: none;
  }
`;

export const FooterBuiltOn = styled.div`
  position: relative;
  @media (max-width: 649px) {
    margin: 12px auto 0;
    right: -25px;
  }
`;

export const FooterBuiltOnImg = styled.img`
  height: 40px;
  width: auto;
  display: block;
`;

export const FooterBuiltOnInner = styled.div`
  font-size: 10px;
  line-height: 1.25;
  position: absolute;
  bottom: -3px;
  left: 42px;
`;

export const FooterCreatedByImg = styled.img`
  width: 129px;
  position: absolute;
  left: -34px;
  bottom: -24px;
`;

export const SubFooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
  @media (max-width: 649px) {
    display: block;
    text-align: center;
    max-width: 225px;
    margin: 42px auto 0;
  }
  p {
    font-size: 0.65rem;
    a {
      text-decoration: underline;
    }
  }
  p,
  && a {
    color: white;
  }
`;
