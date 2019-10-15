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
import PropTypes from 'prop-types';
import { connectToContext, contextPropTypes } from '@knapsack/core';
import SmartGrid from '@knapsack/smart-grid';
import {
  StyledPatternGridListItem,
  PatternGridListItemDescription,
  PatternGridListItemTitle,
  PatternGridListItemType,
  PatternGridListItemHeader,
  PatternGridList,
} from './pattern-list.styles';
import { PatternStatusIcon } from './atoms';
import { BASE_PATHS } from '../../lib/constants';

// @todo fix issue with pattern icons basepath
// class PatternGridItem extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       imgSrc: urlJoin(
//         props.context.settings.patternIconBasePath,
//         `${props.pattern.id}.svg`,
//       ),
//     };
//     this.handleMissingImg = this.handleMissingImg.bind(this);
//     this.defaultImgPath = urlJoin(
//       this.props.context.settings.patternIconBasePath,
//       'default.svg',
//     );
//   }
//
//   handleMissingImg() {
//     console.info(
//       `Could not find image for ${this.props.pattern.id} at "${
//         this.state.imgSrc
//       }", using default image instead.`,
//     );
//     this.setState({
//       imgSrc: this.defaultImgPath,
//     });
//   }
//
//   render() {
//     const { id, path, meta } = this.props.pattern;
//     const { hasIcon, title, description } = meta;
//     return (
//       <StyledPatternGridItem key={id}>
//         <Link to={path || `/patterns/${id}`}>
//           <PatternGridItemThumb
//             src={hasIcon !== false ? this.state.imgSrc : this.defaultImgPath}
//             onError={this.handleMissingImg}
//           />
//           <PatternGridItemTitle>{title}</PatternGridItemTitle>
//           <PatternGridItemDescription>{description}</PatternGridItemDescription>
//         </Link>
//       </StyledPatternGridItem>
//     );
//   }
// }

function PatternGridListItem({
  patternStatuses,
  pattern: {
    id,
    path = `${BASE_PATHS.PATTERN}/${id}`,
    meta: { title, type, status: statusId, description },
  },
}) {
  const status = patternStatuses.find(p => p.id === statusId);
  return (
    <StyledPatternGridListItem key={id}>
      <Link to={path}>
        <PatternGridListItemHeader>
          <PatternGridListItemTitle>{title}</PatternGridListItemTitle>
        </PatternGridListItemHeader>
        <PatternGridListItemType>
          Type: {type}
          {status && (
            <span>
              {' '}
              - Status: {status.title}
              <PatternStatusIcon color={status.color} title={status.title} />
            </span>
          )}
        </PatternGridListItemType>
        <PatternGridListItemDescription>
          {description}
        </PatternGridListItemDescription>
      </Link>
    </StyledPatternGridListItem>
  );
}

function PatternGrid(props) {
  const { enablePatternIcons } = props.context.features;
  return (
    <>
      {enablePatternIcons ? (
        <SmartGrid
          className="pattern-grid-wrapper"
          row-items-xsmall={2}
          row-items-large={3}
          row-items-xlarge={5}
        >
          {/* {props.patterns.map(pattern => ( */}
          {/* <PatternGridItem */}
          {/* key={pattern.id} */}
          {/* pattern={pattern} */}
          {/* context={props.context} */}
          {/* /> */}
          {/* ))} */}
        </SmartGrid>
      ) : (
        <PatternGridList>
          {props.patterns.map(pattern => (
            <PatternGridListItem
              key={pattern.id}
              pattern={pattern}
              patternStatuses={props.patternStatuses}
            />
          ))}
        </PatternGridList>
      )}
    </>
  );
}

PatternGrid.propTypes = {
  patternStatuses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
  patterns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      path: PropTypes.string,
      hasIcon: PropTypes.bool,
    }),
  ).isRequired,
  context: contextPropTypes.isRequired,
};

PatternGridListItem.propTypes = {
  patternStatuses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
  pattern: PropTypes.shape({
    id: PropTypes.string,
    path: PropTypes.string,
    meta: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      type: PropTypes.string,
      status: PropTypes.string,
      hasIcon: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};

export default connectToContext(PatternGrid);
