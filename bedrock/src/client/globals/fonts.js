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
import fontAvenirLightTTF from '../assets/fonts/avenir--light.ttf';
import fontAvenirLightWOFF from '../assets/fonts/avenir--light.woff';
import fontAvenirLightWOFF2 from '../assets/fonts/avenir--light.woff2';
import fontAvenirMediumTTF from '../assets/fonts/avenir--medium.ttf';
import fontAvenirMediumWOFF from '../assets/fonts/avenir--medium.woff';
import fontAvenirMediumWOFF2 from '../assets/fonts/avenir--medium.woff2';
import fontDinCondensedTTF from '../assets/fonts/din-condensed--regular.ttf';
import fontDinCondensedWOFF from '../assets/fonts/din-condensed--regular.woff';
import fontDinCondensedWOFF2 from '../assets/fonts/din-condensed--regular.woff2';

export const addGlobalFonts = `
  @font-face {
      font-family: "AvenirLight";
      src: url("${fontAvenirLightWOFF2}") format("woff2"), url("${fontAvenirLightWOFF}") format("woff"), url("${fontAvenirLightTTF}") format("truetype");
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "AvenirMedium";
      src: url("${fontAvenirMediumWOFF2}") format("woff2"), url("${fontAvenirMediumWOFF}") format("woff"), url("${fontAvenirMediumTTF}") format("truetype");
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "DinCondensed";
      src: url("${fontDinCondensedWOFF2}") format("woff2"), url("${fontDinCondensedWOFF}") format("woff"), url("${fontDinCondensedTTF}") format("truetype");
      font-weight: normal;
      font-style: normal;
    }
`;
