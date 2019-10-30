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
import React from 'react';
import './home-splash.scss';

/**
 * @param {string} x
 * @returns {number}
 * @todo set maximum font size here or in the vw logic
 */
function bigWords(x) {
  // split up the title to individual words
  const titleWords = x.split(' ');
  // find the longest word
  const longestLength = titleWords.sort((a, b) => b.length - a.length)[0]
    .length;
  let vw = 19;
  // switch does not have breaks because we are SURE there will only ever be ONE case satisfied.
  /* eslint-disable no-fallthrough, default-case */
  switch (longestLength) {
    case 9:
      vw = 17;
    case 10:
      vw = 15;
    case 11:
      vw = 13.5;
    case 12:
      vw = 12;
    case 13:
      vw = 11;
    case 14:
      vw = 10;
    case 15:
      vw = 9;
    case 16:
      vw = 8;
    case 17:
      vw = 7;
    case 18:
      vw = 7;
    case 19:
      vw = 7;
    case 20:
      vw = 7;
    case 21:
      vw = 6;
    case 22:
      vw = 6;
    case 23:
      vw = 6;
    case 24:
      vw = 5.5;
    case 25:
      vw = 5.5;
  }
  /* eslint-enable */

  return vw;
}

export interface HomeSplashProps {
  /**
   * The big title of the whole Design System
   */
  title: string;
  subtitle?: string;
  slogan?: string;
  /**
   * Version of the design system
   */
  version?: string;
}

/**
 * The big home page that is between site header and footer
 */
export const HomeSplash: React.FC<HomeSplashProps> = ({
  title,
  subtitle,
  slogan,
  version,
}: HomeSplashProps) => (
  <div className="home-splash">
    <div className="home-splash__inner">
      {subtitle && <h2 className="home-splash__inner__eyebrow">{subtitle}</h2>}
      {title && <h1 style={{ fontSize: `${bigWords(title)}vw` }}>{title}</h1>}
      {slogan && <h2 className="home-splash__inner__subtitle">{slogan}</h2>}
      {version && <p className="home-splash__inner__version">{version}</p>}
    </div>
  </div>
);
