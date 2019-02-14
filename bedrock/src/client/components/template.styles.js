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

export const IFrameWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  position: relative;
`;

export const Resizable = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  resize: horizontal;
  overflow: hidden;
  padding: 10px;
  width: 100%;
  max-width: ${props => props.size || '100%'};
  background-color: rgba(77, 77, 77, 0.15);
`;

export const SizeTab = styled.div`
  position: absolute;
  bottom: 0;
  right: 20px;
  padding: 3px;
  height: 18px;
  line-height: 18px;
  font-size: 10px;
`;
