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

export const DosAndDontsPanelStyled = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
  > div {
    margin-bottom: 1rem;
    background-color: ${props => props.theme.globals.colors.neutralXLight};
    > img {
      border-bottom: solid 8px;
      max-width: 100%;
      height: auto;
      border-bottom-color: ${props =>
        props.do
          ? props.theme.statuses.successColor
          : props.theme.statuses.errorColor};
    }
    figcaption {
      text-align: left;
      padding-top: 1rem;
    }
  }
  strong {
    color: ${props =>
      props.do
        ? props.theme.statuses.successColor
        : props.theme.statuses.errorColor};
  }
`;

export const DosAndDontsWrapper = styled.div`
  background-color: ${props => props.theme.globals.colors.neutralXLight};
  padding: 1rem 0;
  max-width: 1500px;
  margin: 1rem auto;
  @media (min-width: 450px) {
    display: flex;
    justify-content: space-between;
    padding: 0;
    & > * {
      max-width: 50%;
    }
  }
`;
