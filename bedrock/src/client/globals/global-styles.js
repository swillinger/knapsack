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
import { createGlobalStyle } from 'styled-components';
import { addGlobalFonts } from './fonts';
import { addGlobalTypography } from './typography';
import { addGlobalShadows } from './shadows';

const GlobalStyles = createGlobalStyle`
    @charset "UTF-8";
    ${addGlobalFonts}
    * {
      box-sizing: ${props => props.theme.globals.boxSizing};
    }
    .eyebrow {
      color: ${props => props.theme.eyebrows.color};
      font-size: ${props => props.theme.eyebrows.fontSize};
      font-family: ${props => props.theme.eyebrows.fontFamily};
      margin-bottom: 0;
    }
    body {
      color: ${props => props.theme.body.color};
      font-family: ${props => props.theme.body.fontFamily};
      font-size: ${props => props.theme.body.fontSize};
      line-height: ${props => props.theme.body.lineHeight};
      margin: ${props => props.theme.body.margin};
      padding: ${props => props.theme.body.padding};
    }
    img {
      max-width: 100%;
      height: auto;
      vertical-align: middle;
    }
    textarea {
      width: 100%;
    }
    main {
      display: block;
    }
    details summary:hover {
      cursor: pointer;
    }
    details:active, details:focus {
      outline: none;
    }
    :focus {
      outline-color: #e4f0f5;
    }
    hr {
      border-style: solid;
      border-width: 1px 0 0;
      color: currentColor;
      width: 75%;
    }
    code {
      background: rgba(216, 216, 218, 0.8);
      padding: 0 3px;
      border-radius: 4px;
    }
    pre {
      border-radius: 3px;
      white-space: pre-wrap;
      word-break: break-all;
      position: relative;
      padding: 0;
      margin: 0;
      code {
        padding: 1.75em;
        background: black;
        color: white;
        width: 100%;
        display: block;
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
        border-radius: 0;
      }
    }
    
    #app {
      min-height: 100vh;
    }
    ${props => addGlobalTypography(props.theme)}
    /* @todo Once Shadows are on the server, remove this from global import */
    ${addGlobalShadows}
    /* React Table Styling Fixes */
    .ReactTable .rt-table {
      .rt-thead.-header {
        box-shadow: none;
        border-bottom: 1px solid #CCC;
        font-weight: bold;
      }
      .rt-th.rt-resizable-header {
        background: ${props => props.theme.globals.colors.neutralXLight};
        border-top: 3px solid transparent;
        border-bottom: 3px solid transparent;
        color: ${props => props.theme.globals.colors.primary};
        &:focus,
        &:active {
          outline: none;
        }
        &.-sort-asc {
          box-shadow: none;
          border-top: 3px solid ${props => props.theme.globals.colors.primary};
        }
        &.-sort-desc {
          box-shadow: none;
          border-bottom: 3px solid ${props =>
            props.theme.globals.colors.primary};
        }
      }
      .rt-thead.-filters {
        background: #fbfbfb;
      }
      .rt-tbody {
        .rt-td:first-child {
          background: #fbfbfb;
          color: ${props => props.theme.globals.colors.primary};
          font-weight: bold;
        }
      }
    }
`;

export default GlobalStyles;
