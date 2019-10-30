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
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Spinner } from '@knapsack/design-system';
import { Link } from 'react-router-dom';
import { KnapsackContext } from '../context';
import knapsackBranding from '../assets/knapsack-bg-black-trans.svg';
import './footer.scss';

const query = gql`
  {
    meta {
      knapsackVersion
      changelog
    }
    #    settings {
    #      parentBrand {
    #        homepage
    #        title
    #      }
    #    }
  }
`;

class Footer extends Component {
  static contextType = KnapsackContext;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Query query={query}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <p>Error :(</p>;
          const {
            meta: { knapsackVersion, changelog },
            // settings: { parentBrand },
          } = data;
          return (
            <footer className="footer">
              <div className="footer__inner-wrapper">
                <ul className="footer__menu">
                  {this.context.permissions.includes('write') && (
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
                  <div className="footer__built-on__inner">
                    v{knapsackVersion}
                  </div>
                </div>
              </div>
              <div className="footer__sub-footer">
                <p>
                  Download or use of this software is governed by our license
                  agreement available{' '}
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
        }}
      </Query>
    );
  }
}

export default Footer;
