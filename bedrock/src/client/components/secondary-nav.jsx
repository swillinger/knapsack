import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import {
  TypeToFilter,
  TypeToFilterInputWrapper,
  ClearFilterButton,
} from '@basalt/bedrock-atoms';
import Spinner from '@basalt/bedrock-spinner';
import urlJoin from 'url-join';
import { FaTimes } from 'react-icons/fa';
import NavList from './nav-list';
import { containsString } from '../utils/string-helpers';
import { BASE_PATHS } from '../../lib/constants';
import { enableUiCreatePattern } from '../../lib/features';

const secondaryNavQuery = gql`
  {
    pageBuilderPages {
      title
      id
    }
    patterns {
      id
      meta {
        title
      }
    }
    tokenGroups {
      id
      title
      path
    }
  }
`;

class SecondaryNav extends Component {
  // Was used for custom section items in the nav list. Removed for now. Once custom sections are lifted through gql, add this handling back as needed.
  // @todo custom sections in the side nav
  // static prepSectionLinks(sections) {
  //   return flattenArray(
  //     sections.map(section => [
  //       {
  //         title: section.title,
  //         id: section.id,
  //         isHeading: true,
  //       },
  //       ...section.items,
  //     ]),
  //   );
  // }
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
            item.isHeading || containsString(item.title, this.state.filterTerm),
        );
  }

  render() {
    return (
      <Query query={secondaryNavQuery}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <p>Error</p>;

          const {
            patterns = [],
            pageBuilderPages = [],
            tokenGroups = [],
          } = data;
          const items = [
            {
              title: 'Design Tokens',
              id: 'design-tokens',
              path: BASE_PATHS.DESIGN_TOKENS,
              isHeading: true,
            },
            ...tokenGroups,
            {
              title: 'All Tokens',
              id: 'all-design-tokens',
              path: `${BASE_PATHS.DESIGN_TOKENS}/all`,
            },
            {
              title: 'Patterns',
              id: 'patterns',
              path: BASE_PATHS.PATTERNS,
              isHeading: true,
            },
            enableUiCreatePattern
              ? {
                  title: '+ add new pattern',
                  id: 'new-pattern',
                  path: '/new-pattern',
                }
              : null,
            ...patterns.map(pattern => ({
              id: pattern.id,
              title: pattern.meta.title,
              path: urlJoin(BASE_PATHS.PATTERNS, pattern.id),
            })),
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
            // ...SecondaryNav.prepSectionLinks(this.props.context.sections),
            // @todo bring back custom sections through gql
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
                    role="button"
                    onClick={this.handleFilterReset}
                    onKeyPress={this.handleFilterReset}
                    isVisible={!!this.state.filterTerm}
                  >
                    <FaTimes />
                  </ClearFilterButton>
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
