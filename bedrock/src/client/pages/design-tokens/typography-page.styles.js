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

export const TypographyChildrenDemoWrapper = styled.div`
  font-family: ${props => props.fontFamily};
  padding: 1rem 1rem 0;
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 400)};
  font-style: ${props => (props.fontStyle ? props.fontStyle : 'normal')};
  p {
    line-height: ${props => (props.lineHeight ? props.lineHeight : 'inherit')};
  }
  blockquote::first-line {
    font-weight: 800;
  }
  blockquote[contenteditable] {
    border-top: 1px dashed transparent;
    border-right: 1px dashed transparent;
    border-bottom: 1px dashed transparent;
    transition: ${props => props.theme.transitions.all};
  }
  blockquote[contenteditable]:hover {
    border-top: 1px dashed ${props => props.theme.globals.colors.neutralLight};
    border-right: 1px dashed ${props => props.theme.globals.colors.neutralLight};
    border-bottom: 1px dashed
      ${props => props.theme.globals.colors.neutralLight};
  }
  [contenteditable]:not(blockquote) {
    border: 1px dashed transparent;
    transition: ${props => props.theme.transitions.all};
  }
  [contenteditable]:not(blockquote):hover {
    border: 1px dashed ${props => props.theme.globals.colors.neutralLight};
  }
`;

export const FontSizeDemo = styled.div`
  font-size: ${props => props.fontSize};
  border-bottom: ${props =>
    props.length !== props.index
      ? `1px dotted ${props.theme.globals.colors.neutralLight}`
      : ''};
  padding-bottom: ${props =>
    props.length !== props.index ? props.theme.globals.spacing.m : ''};
  margin-bottom: ${props =>
    props.length !== props.index ? props.theme.globals.spacing.l : ''};

  blockquote::first-line {
    font-weight: 800;
  }
`;
