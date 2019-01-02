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

export const PatternHeader = styled.header`
  position: relative;
  margin-bottom: 2rem;
`;

export const OverviewWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  ${({ fullScreen }) =>
    fullScreen &&
    `
      position: fixed;
      background-color: white;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10000;
      height: 100vh;
  `};
`;

export const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const DemoGridControls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1.5rem;
  margin-left: auto;
  > * {
    margin: 0 0.25rem;
  }
  .button {
    min-height: 33px;
  }
`;
