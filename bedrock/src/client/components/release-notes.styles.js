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

export const ReleaseWrapper = styled.div`
  padding: 1rem;
`;

export const ReleaseVersion = styled.h3`
  margin-bottom: 0.5rem;
`;

export const ReleaseDate = styled.h5`
  margin-bottom: 1rem;
`;

export const ReleaseCommit = styled.p`
  margin-bottom: 0;
  line-height: 2;
`;

export const CommitHash = styled.a`
  background-color: #9a9b9f;
  padding: 0.35rem 0.75rem;
  color: black !important;
  border-radius: 0;
  width: 92px;
`;
