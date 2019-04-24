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

export const HomeSplashWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`;

export const HomeSplashCore = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  text-align: right;
  @media screen and (min-width: 450px) {
    padding: 2rem;
  }
`;

export const EyeBrow = styled.h2`
  color: grey;
  margin: 0 0 -0.25rem;
  font-size: 3.75vw;
  @media screen and (min-width: 600px) {
    font-size: 2.75vw;
  }
  @media screen and (min-width: 1000px) {
    margin: 0;
  }
`;

export const Title = styled.h1`
  font-size: ${props => (props.vw ? props.vw : 10)}vw;
  line-height: 1;
  @media screen and (min-width: 900px) {
    font-size: 170px;
  }
`;

export const Subtitle = styled.h2`
  font-size: 4vw;
  @media screen and (min-width: 600px) {
    font-size: 3vw;
  }
`;

export const VersionTag = styled.p`
  margin-top: -1rem;
  font-size: 3vw;
  @media screen and (min-width: 600px) {
    font-size: 2vw;
  }
`;
