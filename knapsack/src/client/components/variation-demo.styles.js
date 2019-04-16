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

export const VariationsWrapper = styled.div`
  margin: 2rem 0;
  .form-group > div:first-child {
    display: none;
  }
`;

export const VariationItem = styled.div`
  padding: ${props => props.theme.globals.spacing.s}
    ${props => props.theme.globals.spacing.m};
  border-bottom: 1px solid ${props => props.colorTheme};
  .form-group.field {
    margin-top: 0;
  }
`;

export const VariationItemExpanded = styled.div`
  border-bottom: 1px solid ${props => props.colorTheme};
  &:last-of-type {
    border-bottom: 0;
  }
  h4 {
    border-bottom: 1px solid ${props => props.colorTheme};
    color: ${props => props.colorTheme};
    padding: ${props => props.theme.globals.spacing.m};
    margin: 0;
  }
`;

export const HeaderRegion = styled.div`
  background: ${props => props.colorThemeAccent};
  border-bottom: 10px solid ${props => props.colorTheme};
  border-top-right-radius: ${props => props.theme.globals.borders.radius};
  border-top-left-radius: ${props => props.theme.globals.borders.radius};
  padding: 30px;
  line-height: 1;
  position: relative;
  h5 {
    color: ${props => props.colorTheme};
  }
`;

export const HeaderInner = styled.div`
  font-family: ${props => props.theme.globals.fonts.avenir.medium};
  cursor: pointer;
  position: absolute;
  color: ${props => props.colorTheme};
  font-weight: bold;
  display: inline-block;
  right: 15px;
  bottom: 15px;
`;

export const FooterRegion = styled.div`
  border-top: 1px solid ${props => props.colorTheme};
  padding: 18px 15px 15px;
  summary {
    color: ${props => props.colorTheme};
    outline: none;
    user-select: none;
    font-weight: bold;
  }
  details[open] summary {
    color: #000;
  }
  pre {
    color: ${props => props.colorTheme};
    margin: 0;
  }
`;
