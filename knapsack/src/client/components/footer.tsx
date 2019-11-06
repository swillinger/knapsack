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
import { Link } from 'react-router-dom';
import { useSelector } from '../store';
import knapsackBranding from '../assets/knapsack-bg-black-trans.svg';
import './footer.scss';

const Footer: React.FC = () => {
  const permissions = useSelector(store => store.userState.role.permissions);
  const { changelog, knapsackVersion } = useSelector(
    store => store.metaState.meta,
  );

  return (
    <footer className="footer">
      <div className="footer__inner-wrapper">
        <ul className="footer__menu">
          {permissions.includes('write') && (
            <li className="footer__menu-item">
              <Link to="/settings">Site Settings</Link>
            </li>
          )}
          <li className="footer__menu-item">
            <a href="https://knapsack.basalt.io/">Knapsack Docs</a>
          </li>
          <li className="footer__menu-item">
            <a href="/demo-urls">Demo URLs</a>
          </li>
          {changelog && (
            <li className="footer__menu-item">
              <Link to="/changelog">Changelog</Link>
            </li>
          )}
        </ul>
        <div className="footer__built-on">
          <a
            href="https://knapsack.basalt.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={knapsackBranding} alt="Knapsack" />
          </a>
          <div className="footer__built-on__inner">v{knapsackVersion}</div>
        </div>
      </div>
      <div className="footer__sub-footer">
        <p>
          Download or use of this software is governed by our license agreement
          available{' '}
          <a
            href="https://knapsack-license.now.sh"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
