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
import { BlockQuoteWrapper } from '@basalt/bedrock-atoms';
import { connectToContext, contextPropTypes } from '@basalt/bedrock-core';
import { apiUrlBase } from '../data';
import {
  ReleaseCommit,
  CommitHash,
  ReleaseDate,
  ReleaseWrapper,
  ReleaseVersion,
} from './release-notes.styles';

const releaseNote = items =>
  items.map(item => (
    <ReleaseWrapper key={item.title}>
      <ReleaseVersion>{item.title}</ReleaseVersion>
      <ReleaseDate>{item.niceDate}</ReleaseDate>
      {item.commits.map(commit => (
        <ReleaseCommit key={commit.shorthash}>
          <CommitHash href={commit.href} target="_blank">
            {commit.shorthash}
          </CommitHash>{' '}
          {commit.message}
        </ReleaseCommit>
      ))}
    </ReleaseWrapper>
  ));

const ReleaseNoteList = ({ items }) => <div>{releaseNote(items)}</div>;

ReleaseNoteList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      niceDate: PropTypes.string.isRequired,
      commits: PropTypes.arrayOf(
        PropTypes.shape({
          href: PropTypes.string.isRequired,
          shorthash: PropTypes.string.isRequired,
          message: PropTypes.string.isRequired,
        }),
      ),
    }),
  ).isRequired,
};

class ReleaseNotesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      releaseNotes: [],
    };
  }

  componentDidMount() {
    const apiEndpoint = apiUrlBase;
    window
      .fetch(`${apiEndpoint}/releasenotes`)
      .then(res => res.json())
      .then(releaseNotes => {
        this.setState({ releaseNotes });
      });
  }

  render() {
    const { enableBlockquotes } = this.props.context.features;
    return (
      <div>
        <div className="body">
          <h4 className="eyebrow">About</h4>
          <h2>Release Notes</h2>
          {enableBlockquotes && (
            <BlockQuoteWrapper>
              Take note, we are releasing some amazing things.
              <footer>Evan Lovely, CTO</footer>
            </BlockQuoteWrapper>
          )}
        </div>
        <ReleaseNoteList items={this.state.releaseNotes} />
      </div>
    );
  }
}

ReleaseNotesPage.propTypes = {
  context: contextPropTypes.isRequired,
};

export default connectToContext(ReleaseNotesPage);
