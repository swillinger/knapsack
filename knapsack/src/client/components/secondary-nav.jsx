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
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import {
  TypeToFilter,
  TypeToFilterInputWrapper,
  ClearFilterButton,
  Spinner,
} from '@knapsack/design-system';
import { flattenArray } from '@knapsack/utils';
import urlJoin from 'url-join';
import { NavList } from './nav-list';
import { containsString } from '../utils/string-helpers';
import { BASE_PATHS } from '../../lib/constants';
import { enableUiCreatePattern } from '../../lib/features';

const secondaryNavQuery = gql`
  {
    pageBuilderPages {
      title
      id
    }
    patternTypes {
      id
      title
      patterns {
        id
        meta {
          title
          status
        }
      }
    }
    docs {
      id
      data {
        title
      }
    }
    patternStatuses {
      id
      title
      color
    }
    settings {
      customSections {
        id
        title
        pages {
          id
          title
        }
      }
    }
  }
`;

class SecondaryNav extends Component {
  // Was used for custom section items in the nav list. Removed for now. Once custom sections are lifted through gql, add this handling back as needed.
  static prepSectionLinks(sections) {
    if (!sections) return [];
    return flattenArray(
      sections.map(section => [
        {
          title: section.title,
          id: section.id,
          isHeading: true,
        },
        ...section.pages.map(page => ({
          ...page,
          path: `/${section.id}/${page.id}`,
        })),
      ]),
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      filterTerm: '',
    };
    this.handleFilterReset = this.handleFilterReset.bind(this);
    this.filterNavItems = this.filterNavItems.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.pathname !== prevProps.pathname) {
      this.handleFilterReset();
    }
  }

  handleFilterReset() {
    this.setState({
      filterTerm: '',
    });
  }

  filterNavItems(items) {
    return this.state.filterTerm === ''
      ? items
      : items.filter(
          item =>
            item.isHeading ||
            item.isSubHeading ||
            containsString(item.title, this.state.filterTerm),
        );
  }

  render() {
    return (
      <Query query={secondaryNavQuery}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <p>Error</p>;

          const {
            patternTypes = [],
            pageBuilderPages = [],
            docs = [],
            patternStatuses = [],
            settings: { customSections = [] },
          } = data;

          const patternItems = [];
          patternTypes.forEach(patternType => {
            patternItems.push({
              id: patternType.id,
              title: patternType.title,
              isSubHeading: true,
              path: urlJoin(BASE_PATHS.PATTERNS, patternType.id),
            });

            patternType.patterns.forEach(pattern => {
              const status = patternStatuses.find(
                p => p.id === pattern.meta.status,
              );
              patternItems.push({
                id: pattern.id,
                // title: pattern.meta.title,
                status,
                title: pattern.meta.title,
                path: urlJoin(BASE_PATHS.PATTERN, pattern.id),
              });
            });
          });

          const items = [
            {
              title: 'Patterns',
              id: 'patterns',
              path: `${BASE_PATHS.PATTERNS}/all`,
              isHeading: true,
            },
            enableUiCreatePattern
              ? {
                  title: '+ add new pattern',
                  id: 'new-pattern',
                  path: '/new-pattern',
                }
              : null,
            ...patternItems,
            {
              title: 'Page Builder',
              id: 'page-builder',
              isHeading: true,
              path: BASE_PATHS.PAGES,
            },
            ...pageBuilderPages.map(page => ({
              id: page.id,
              title: page.title,
              path: `${BASE_PATHS.PAGES}/${page.id}`,
            })),
            docs.length
              ? {
                  title: 'Docs',
                  id: 'docs',
                  isHeading: true,
                  path: BASE_PATHS.DOCS,
                }
              : null,
            ...docs.map(doc => ({
              id: doc.id,
              title: doc.data.title,
              path: `${BASE_PATHS.DOCS}/${doc.id}`,
            })),
            ...SecondaryNav.prepSectionLinks(customSections),
            {
              title: 'API',
              id: 'graphiql',
              isHeading: true,
              path: BASE_PATHS.GRAPHIQL_PLAYGROUND,
            },
          ].filter(Boolean);

          return (
            <>
              <TypeToFilter>
                <h4 className="eyebrow">Filter List</h4>
                <TypeToFilterInputWrapper>
                  <input
                    type="text"
                    className="type-to-filter"
                    placeholder="Type to filter..."
                    value={this.state.filterTerm}
                    onChange={event =>
                      this.setState({ filterTerm: event.target.value })
                    }
                  />
                  <ClearFilterButton
                    onClick={this.handleFilterReset}
                    onKeyPress={this.handleFilterReset}
                    isVisible={!!this.state.filterTerm}
                  />
                </TypeToFilterInputWrapper>
              </TypeToFilter>
              <NavList items={this.filterNavItems(items)} />
            </>
          );
        }}
      </Query>
    );
  }
}

SecondaryNav.propTypes = {
  pathname: PropTypes.string,
};

SecondaryNav.defaultProps = {
  pathname: null,
};

export default SecondaryNav;
