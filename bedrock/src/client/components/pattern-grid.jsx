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
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connectToContext, contextPropTypes } from '@basalt/bedrock-core';
import SmartGrid from '@basalt/bedrock-smart-grid';
import {
  StyledPatternGridListItem,
  PatternGridListItemDescription,
  PatternGridListItemTitle,
  PatternGridListItemType,
  PatternGridListItemHeader,
  PatternGridList,
} from './pattern-list.styles';
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

function PatternGridListItem(props) {
  return (
    <StyledPatternGridListItem key={props.pattern.id}>
      <Link
        to={
          props.pattern.path
            ? props.pattern.path
            : `${BASE_PATHS.PATTERN}/${props.pattern.id}`
        }
      >
        <PatternGridListItemHeader>
          <PatternGridListItemTitle>
            {props.pattern.meta.title}
          </PatternGridListItemTitle>
          <PatternGridListItemType>
            {props.pattern.meta.type}
          </PatternGridListItemType>
        </PatternGridListItemHeader>
        <PatternGridListItemDescription>
          {props.pattern.meta.description}
        </PatternGridListItemDescription>
      </Link>
    </StyledPatternGridListItem>
  );
}

function PatternGrid(props) {
  const { enablePatternIcons } = props.context.features;
  return (
    <React.Fragment>
      {enablePatternIcons ? (
        <SmartGrid
          className="pattern-grid-wrapper"
          row-items-xsmall={2}
          row-items-large={3}
          row-items-xlarge={5}
        >
          <span>@todo custom pattern icons feature coming soon</span>
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
            <PatternGridListItem key={pattern.id} pattern={pattern} />
          ))}
        </PatternGridList>
      )}
    </React.Fragment>
  );
}

PatternGrid.propTypes = {
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
  pattern: PropTypes.shape({
    id: PropTypes.string,
    path: PropTypes.string,
    meta: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      type: PropTypes.string,
      hasIcon: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};

export default connectToContext(PatternGrid);
