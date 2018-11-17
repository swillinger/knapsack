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

const secondaryNavQuery = gql`
  {
    examples {
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
    if (this.props.location.pathname !== prevProps.location.pathname) {
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
            item.title
              .toLowerCase()
              .search(this.state.filterTerm.toLowerCase()) !== -1,
        );
  }

  render() {
    return (
      <Query query={secondaryNavQuery}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <p>Error</p>;

          const { patterns = [], examples = [], tokenGroups = [] } = data;
          const items = [
            {
              title: 'Design Tokens',
              id: 'design-tokens',
              path: '/design-tokens',
              isHeading: true,
            },
            {
              title: 'All Tokens',
              id: 'all-design-tokens',
              path: '/design-tokens/all',
            },
            ...tokenGroups.map(tokenGroup => ({
              id: tokenGroup.id,
              title: tokenGroup.title,
              path: urlJoin('/design-tokens', tokenGroup.id),
            })),
            {
              title: 'Patterns',
              id: 'patterns',
              path: '/patterns',
              isHeading: true,
            },
            {
              title: '+ add new pattern',
              id: 'new-pattern',
              path: '/new-pattern',
            },
            ...patterns.map(pattern => ({
              id: pattern.id,
              title: pattern.meta.title,
              path: urlJoin('/patterns', pattern.id),
            })),
            {
              title: 'Examples',
              id: 'example-heading',
              isHeading: true,
              path: '/examples',
            },
            ...examples.map(example => ({
              id: example.id,
              title: example.title,
              path: `/examples/${example.id}`,
            })),
            // ...SecondaryNav.prepSectionLinks(this.props.context.sections),
            // @todo bring back custom sections through gql
          ];
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
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default SecondaryNav;
