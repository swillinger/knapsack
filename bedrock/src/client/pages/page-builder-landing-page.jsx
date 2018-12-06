import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { BlockQuoteWrapper, Button, TwoUp } from '@basalt/bedrock-atoms';
import { connectToContext, contextPropTypes } from '@basalt/bedrock-core';
import { apiUrlBase } from '../data';
import { BASE_PATHS } from '../../lib/constants';
import PageWithSidebar from '../layouts/page-with-sidebar';

const examplesQuery = gql`
  {
    pageBuilderPages {
      title
      id
    }
  }
`;

function makeNewExample() {
  const id = shortid.generate();
  window
    .fetch(`${apiUrlBase}${BASE_PATHS.PAGES}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        title: 'My New Example',
        path: `${BASE_PATHS.PAGES}/${id}`,
        slices: [],
      }),
    })
    .then(res => {
      res.json();
    })
    .then(() => {
      window.location = `${BASE_PATHS.PAGES}/${id}`;
    });
}

function PageBuilderLandingPage(props) {
  const { enableBlockquotes } = props.context.features;
  return (
    <Query query={examplesQuery}>
      {({ data }) => {
        const { pageBuilderPages = [] } = data;
        return (
          <PageWithSidebar location={props.location}>
            <h4 className="eyebrow">Prototyping Pages</h4>
            <h2>Page Builder</h2>
            {enableBlockquotes && (
              <BlockQuoteWrapper>
                When I design buildings, I think of the overall composition,
                much as the parts of a body would fit together. On top of that,
                I think about how people will approach the building and
                experience that space.
                <footer>Tadao Ando</footer>
              </BlockQuoteWrapper>
            )}
            <TwoUp>
              <div>
                <h3>What is prototyping?</h3>
                <p>
                  Website prototypes are mock-ups or demos of what a website
                  will look like when it is in production. Our powerful
                  prototyping tool allows designers to quickly assemble,
                  arrange, and add content to the reusable components of a
                  design system. This allows designers and content editors to
                  rapidly test new ideas, create example page layouts, and share
                  ideas with the rest of the team.
                </p>
              </div>
              <div>
                <h3>Pages</h3>
                <ul>
                  {pageBuilderPages.map(({ id, title }) => (
                    <li key={id}>
                      <Link to={`${BASE_PATHS.PAGES}/${id}`}>{title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </TwoUp>
            <div>
              <h3>Create a New Page</h3>
              <Button
                primary
                onClick={makeNewExample}
                onKeyPress={makeNewExample}
                type="submit"
              >
                Get Started
              </Button>
            </div>
          </PageWithSidebar>
        );
      }}
    </Query>
  );
}

PageBuilderLandingPage.defaultProps = {
  location: BASE_PATHS.PAGES,
};

PageBuilderLandingPage.propTypes = {
  context: contextPropTypes.isRequired,
  location: PropTypes.object,
};

export default connectToContext(PageBuilderLandingPage);
