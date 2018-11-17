import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connectToContext, contextPropTypes } from '@basalt/bedrock-core';
import { FaExternalLinkAlt } from 'react-icons/fa';
import {
  PatternListItemDescription,
  PatternListItemThumb,
  PatternListItemWrapper,
} from './playground.styles';

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
//       <PatternListItemWrapper
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
//               <PatternListItemThumb
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
//             <PatternListItemDescription>
//               {this.props.pattern.meta.description}
//             </PatternListItemDescription>
//           )}
//         </div>
//         <Link
//           target="_blank"
//           to={`/patterns/${this.props.pattern.id}`}
//           title="Open component details in new window"
//         >
//           Details <FaExternalLinkAlt size={8} />
//         </Link>
//       </PatternListItemWrapper>
//     );
//   }
// }

function PlaygroundSidebarPatternListItem(props) {
  const { enablePatternIcons = false } = props.context.features || {};
  return (
    <PatternListItemWrapper
      key={props.pattern.id}
      thumb={enablePatternIcons}
      type="button"
    >
      <div
        role="button"
        tabIndex={0}
        onKeyPress={() => props.handleAddSlice(props.pattern.id)}
        onClick={() => props.handleAddSlice(props.pattern.id)}
      >
        <h5>{props.pattern.meta.title}</h5>
        {enablePatternIcons ? (
          <>
            <span>
              Pattern Icons is not a currently supported feature. Please toggle
              feature flag enablePatternIcons to false.
            </span>
            <PatternListItemThumb
              src={
                /* this.props.pattern.meta.hasIcon ? this.state.imgSrc : this.defaultImgPath */ null
              }
              onError={/* this.handleMissingImg */ null}
              alt={/* this.props.pattern.meta.title */ null}
            />
          </>
        ) : (
          <PatternListItemDescription>
            {props.pattern.meta.description}
          </PatternListItemDescription>
        )}
      </div>
      <Link
        target="_blank"
        to={`/patterns/${props.pattern.id}`}
        title="Open component details in new window"
      >
        Details <FaExternalLinkAlt size={8} />
      </Link>
    </PatternListItemWrapper>
  );
}

PlaygroundSidebarPatternListItem.propTypes = {
  pattern: PropTypes.object.isRequired,
  handleAddSlice: PropTypes.func.isRequired,
  context: contextPropTypes.isRequired,
};

export default connectToContext(PlaygroundSidebarPatternListItem);
