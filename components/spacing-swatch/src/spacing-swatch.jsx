import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from '@knapsack/copy-to-clipboard';
import './spacing-swatch.scss';

const SpacingSwatch = ({ space }) => (
  <div className="spacing-swatch">
    <span
      className="spacing-swatch__spacing-outer"
      style={{
        height: space.value,
        width: space.value,
      }}
    />
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
  </div>
);

/* eslint-disable no-useless-constructor, react/prefer-stateless-function */
class SpacingSwatches extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const spaceSwatches = this.props.spaces.map(space => (
      <SpacingSwatch key={space.name} space={space} />
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
};

SpacingSwatches.propTypes = {
  spaces: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SpacingSwatches;
