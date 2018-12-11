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
import React from 'react';
import PropTypes from 'prop-types';
import { connectToContext } from '@basalt/bedrock-core';
import Spinner from '@basalt/bedrock-spinner';
import urlJoin from 'url-join';
import { apiUrlBase } from '../data';
import PageWithSidebar from '../layouts/page-with-sidebar';

class CustomSectionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: {},
    };
    this.apiEndpoint = `${apiUrlBase}/section/`;
  }

  componentDidMount() {
    window
      .fetch(urlJoin(this.apiEndpoint, this.props.sectionId, this.props.id))
      .then(res => res.json())
      .then(page => {
        if (!page.ok) {
          // @todo Set error message
          console.error(`uh oh`, page);
        }
        this.setState({
          page: page.data,
          ready: true,
        });
      });
  }

  render() {
    if (!this.state.ready) {
      return <Spinner />;
    }
    const { title, contents } = this.state.page;
    return (
      <PageWithSidebar {...this.props}>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: contents }} />
      </PageWithSidebar>
    );
  }
}

CustomSectionPage.propTypes = {
  // context: contextPropTypes.isRequired,
  sectionId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default connectToContext(CustomSectionPage);
