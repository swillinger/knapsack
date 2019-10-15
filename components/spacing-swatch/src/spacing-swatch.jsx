import React from 'react';
import PropTypes from 'prop-types';
import { connectToContext } from '@knapsack/core';
import CopyToClipboard from '@knapsack/copy-to-clipboard';
import { SpacingOuter, SpacingWrapper } from './spacing-swatch.styles';

const SpacingSwatch = ({ space, color }) => (
  <SpacingWrapper>
    <SpacingOuter space={space.value} color={color} />
    <div>
      {space.code && (
        <h6>
          <CopyToClipboard snippet={space.code} />
          <br />
          <CopyToClipboard snippet={space.value} />
          {space.comment && <small>{space.comment}</small>}
        </h6>
      )}
    </div>
    <div />
  </SpacingWrapper>
);

/* eslint-disable no-useless-constructor, react/prefer-stateless-function */
class SpacingSwatches extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { accentColor } = this.props.context.theme.globals.colors;
    const spaceSwatches = this.props.spaces.map(space => (
      <SpacingSwatch key={space.name} space={space} color={accentColor} />
    ));

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '600px',
        }}
      >
        {spaceSwatches}
      </div>
    );
  }
}

SpacingSwatch.propTypes = {
  space: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    code: PropTypes.string,
  }).isRequired,
  color: PropTypes.string.isRequired,
};

SpacingSwatches.propTypes = {
  spaces: PropTypes.arrayOf(PropTypes.object).isRequired,
  context: PropTypes.object.isRequired,
};

export default connectToContext(SpacingSwatches);
