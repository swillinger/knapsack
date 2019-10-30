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
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Select, Button } from '@knapsack/design-system';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { connectToContext, contextPropTypes } from '../../context';
import { PageBuilderContext } from './page-builder-context';
import './page-builder-pattern-list-item.scss';

// @todo Get pattern icons working for this again
// class PlaygroundSidebarPatternListItem extends Component {
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
//     const { enablePatternIcons = false } = this.props.context.features || {};
//     return (
//       <li
//         className={`page-builder-pattern-list-item__item-wrapper
//           ${enablePatternIcons ? 'page-builder-pattern-list-item__item-wrapper--thumb' : ''}`}
//         key={this.props.pattern.id}
//         thumb={enablePatternIcons}
//         type="button"
//       >
//         <div
//           role="button"
//           tabIndex={0}
//           onKeyPress={() => this.props.handleAddSlice(this.props.pattern.id)}
//           onClick={() => this.props.handleAddSlice(this.props.pattern.id)}
//         >
//           <h5>{this.props.pattern.meta.title}</h5>
//           {enablePatternIcons ? (
//             <>
//               <span>
//                 Pattern Icons is not a currently supported feature. Please
//                 toggle feature flag enablePatternIcons to false.
//               </span>
//               <img
//                 className="page-builder-pattern-list-item__thumb"
//                 src={
//                   this.props.pattern.meta.hasIcon
//                     ? this.state.imgSrc
//                     : this.defaultImgPath
//                 }
//                 onError={this.handleMissingImg}
//                 alt={this.props.pattern.meta.title}
//               />
//             </>
//           ) : (
//             <div className="page-builder-pattern-list-item__description">
//               {this.props.pattern.meta.description}
//             </div>
//           )}
//         </div>
//         <Link
//           target="_blank"
//           to={`/patterns/${this.props.pattern.id}`}
//           title="Open component details in new window"
//         >
//           Details <FaExternalLinkAlt size={8} />
//         </Link>
//       </li>
//     );
//   }
// }

class PlaygroundSidebarPatternListItem extends Component {
  static contextType = PageBuilderContext;

  constructor(props) {
    super(props);
    this.state = {
      templateId: props.pattern.templates[0].id,
    };
  }

  render() {
    const { enablePatternIcons = false } = this.props.context.features || {};
    const { pattern } = this.props;
    return (
      <li
        className={`page-builder-pattern-list-item__item-wrapper
          ${
            enablePatternIcons
              ? 'page-builder-pattern-list-item__item-wrapper--thumb'
              : ''
          }`}
        key={this.props.pattern.id}
        thumb={enablePatternIcons}
      >
        <div>
          <h5>{pattern.meta.title}</h5>
          {enablePatternIcons ? (
            <>
              <span>
                Pattern Icons is not a currently supported feature. Please
                toggle feature flag enablePatternIcons to false.
              </span>
              <img
                className="page-builder-pattern-list-item__thumb"
                src={
                  /* this.props.pattern.meta.hasIcon ? this.state.imgSrc : this.defaultImgPath */ null
                }
                onError={/* this.handleMissingImg */ null}
                // alt={this.props.pattern.meta.title}
                alt=""
              />
            </>
          ) : (
            <div className="page-builder-pattern-list-item__description">
              {pattern.meta.description}
            </div>
          )}
        </div>
        <Select
          value={this.state.templateId}
          handleChange={templateId => this.setState({ templateId })}
          items={pattern.templates.map(template => ({
            value: template.id,
            title: template.title,
          }))}
        />
        <br />
        <Button
          onKeyPress={() =>
            this.context.handleAddSlice(
              this.props.pattern.id,
              this.state.templateId,
            )
          }
          onClick={() =>
            this.context.handleAddSlice(
              this.props.pattern.id,
              this.state.templateId,
            )
          }
        >
          Add
        </Button>
        <br />
        <Link
          target="_blank"
          to={`/patterns/${this.props.pattern.id}`}
          title="Open component details in new window"
        >
          Details <FaExternalLinkAlt size={8} />
        </Link>
      </li>
    );
  }
}

PlaygroundSidebarPatternListItem.propTypes = {
  pattern: PropTypes.object.isRequired,
  context: contextPropTypes.isRequired,
};

export default connectToContext(PlaygroundSidebarPatternListItem);
