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

export const DemoStage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-image: linear-gradient(45deg, hsl(0, 0%, 90%) 25%, transparent 25%),
    linear-gradient(-45deg, hsl(0, 0%, 90%) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, hsl(0, 0%, 90%) 75%),
    linear-gradient(-45deg, transparent 75%, hsl(0, 0%, 90%) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  width: 100%;
  @media (min-width: 900px) {
    width: ${({ size }) => {
      switch (size) {
        case 's':
          return '33%';
        case 'm':
          return '50%';
        case 'l':
          return '67%';
        default:
          return '100%';
      }
    }};
  }
`;

export const DemoGrid = styled.div`
  display: block;
  position: relative;
  flex-grow: 1;
  @media (min-width: 900px) {
    display: ${props => (props.size === 'full' ? 'block' : 'flex')};
  }
`;

export const SchemaFormWrapper = styled.div`
  display: flex;
  justify-content: center;
  overflow: initial;
  overflow-y: visible;
  border: dotted 1px #ccc;
  position: relative;
  padding: 0.5rem;
  width: 100%;
  @media (min-width: 900px) {
    width: ${({ size }) => {
      switch (size) {
        case 's':
          return '67%';
        case 'm':
          return '50%';
        case 'l':
          return '33%';
        default:
          return '100%';
      }
    }};
  }
`;

export const SchemaFormWrapperInner = styled.div`
  position: ${props => (props.size === 'full' ? 'static' : '')};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  max-width: 800px;
  fieldset > legend,
  fieldset > legend + p {
    display: none;
  }
  form > div > label {
    display: none;
  }
`;
