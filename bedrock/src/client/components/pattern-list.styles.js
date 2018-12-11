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

export const PatternGridList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

export const StyledPatternGridListItem = styled.li`
  margin-top: ${props => props.theme.globals.spacing.m};
  border-left: 3px solid ${props => props.theme.globals.colors.neutralLight};
  padding: ${props => props.theme.globals.spacing.s}
    ${props => props.theme.globals.spacing.m};
  width: 50%;
  display: inline-block;
  vertical-align: top;
  & > a {
    text-decoration: none;
    transition: ${props => props.theme.transitions.all};
  }
`;

export const PatternGridListItemTitle = styled.h3`
  margin: 0;
`;

export const PatternGridListItemDescription = styled.div`
  line-height: 1.25;
  font-size: calc(${props => props.theme.globals.fontSize} * 0.88);
  color: ${props => props.theme.globals.colors.neutralDark};
  font-style: italic;
`;
