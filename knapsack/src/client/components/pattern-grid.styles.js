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

export const StyledPatternGridItem = styled.div`
  background: #fff;
  position: relative;
  width: 100%;
  transition: ${props => props.theme.transitions.all};
  @media (min-width: ${props => props.theme.globals.breakpoints.medium}) {
    .pattern-grid-wrapper:hover & {
      filter: blur(0.75px);
    }
    &:hover {
      filter: blur(0px) !important;
      z-index: 100;
    }
  }
  > a:link,
  > a:visited {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: ${props => props.theme.links.fontFamily};
    text-decoration: ${props => props.theme.links.textDecoration};
    padding: ${props => props.theme.globals.spacing.l}
      ${props => props.theme.globals.spacing.l} 0;
    height: 100%;
    border: ${props => props.theme.globals.borders.border};
    border-radius: ${props => props.theme.globals.borders.radius};
    text-align: center;
    transition: ${props => props.theme.transitions.all};
    position: relative;
    z-index: 100;
  }
  @media (min-width: ${props => props.theme.globals.breakpoints.medium}) {
    > a:hover {
      position: absolute;
      background: #fff;
      border-radius: ${props => props.theme.globals.borders.radius};
      border-color: ${props => props.theme.globals.colors.primary};
      transform: scale(1.15);
      width: 100%;
      height: auto;
      z-index: 200;
    }
  }
`;

export const PatternGridItemThumb = styled.img`
  display: block;
  max-width: 250px;
  width: 100%;
  max-height: 110px;
  margin: 0 auto 15px;
  filter: grayscale(75%);
  transition: ${props => props.theme.transitions.all};
  /* stylelint-disable */
  ${StyledPatternGridItem}:hover & {
    filter: grayscale(0%);
  }
  /* stylelint-enablee */
`;

export const PatternGridItemTitle = styled.span`
  color: #000;
  margin-bottom: -3px;
  border-bottom: 5px solid ${props => props.theme.globals.colors.primary};
  display: inline-block;
  transition: ${props => props.theme.transitions.all};
`;

export const PatternGridItemDescription = styled.div`
  font-family: ${props => props.theme.globals.fonts.avenir.light};
  line-height: 1.25;
  font-size: calc({props => props.theme.globals.fontSize} * 0.77);
  color: #000;
  font-style: italic;
  padding: ${props => props.theme.globals.spacing.m} 0
    ${props => props.theme.globals.spacing.m};
  max-width: 250px;
  margin: 0 auto;
  @media (min-width: ${props => props.theme.globals.breakpoints.medium}) {
    padding: calc(
        ${props => props.theme.globals.spacing.m} +
          ${props => props.theme.globals.spacing.s}
      )
      0
      calc(
        ${props => props.theme.globals.spacing.m} +
          ${props => props.theme.globals.spacing.s}
      );
    opacity: 0;
    height: 0;
    pointer-events: none;
    transform: scale(0.75);
    position: absolute;
    transition: all 0.1s ease-in-out;
    ${StyledPatternGridItem} > a:hover & {
      opacity: 1;
      transform: scale(1);
      height: auto;
      position: relative;
    }
  }
`;
