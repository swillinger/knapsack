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

export const DemoTransitionOpacity = styled.div`
  background: ${props => props.theme.globals.colors.neutralLight};
  padding: ${props => props.theme.globals.spacing.m};
  margin-bottom: ${props => props.theme.globals.spacing.m};
  text-align: center;
  border-radius: 0;
  cursor: pointer;
  max-width: 800px;
  transition: opacity ${props => props.theme.transitions.speed_and_function};
  &:hover {
    opacity: 0;
  }
`;

export const DemoTransitionMove = styled.div`
  background: ${props => props.theme.globals.colors.neutralLight};
  padding: ${props => props.theme.globals.spacing.m};
  margin-bottom: ${props => props.theme.globals.spacing.m};
  text-align: center;
  border-radius: 0;
  cursor: pointer;
  max-width: 800px;
  position: relative;
  &:after {
    content: '';
    display: inline-block;
    position: absolute;
    width: 3px;
    top: 0;
    left: 8px;
    bottom: 0;
    background: black;
    transition: left ${props => props.theme.transitions.speed_and_function};
  }
  &:hover:after {
    left: calc(100% - 8px);
  }
`;
