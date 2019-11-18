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
import PropTypes from 'prop-types';
import { BlockQuoteWrapper } from '@knapsack/design-system';
import { connectToContext, contextPropTypes } from '../context';
import { apiUrlBase } from '../../lib/constants';
import './release-notes.scss';

const releaseNote = items =>
  items.map(item => (
    <div className="ks-release-notes" key={item.title}>
      <h3>{item.title}</h3>
      <h5>{item.niceDate}</h5>
      {item.commits.map(commit => (
        <p key={commit.shorthash}>
          <a
            className="ks-release-notes__commit-hash"
            href={commit.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {commit.shorthash}
          </a>{' '}
          {commit.message}
        </p>
      ))}
    </div>
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
        <div className="ks-body">
          <h4 className="ks-eyebrow">About</h4>
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
