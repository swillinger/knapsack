import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TabbedPanel from '@basalt/bedrock-tabbed-panel';

import PrettyCode from '@basalt/bedrock-pretty-code';

class CodeBlock extends Component {
  constructor(props) {
    super(props);
  }

  // @todo Setup code highlighting
  componentDidMount() {}

  render() {
    const items = this.props.items.map(item => {
      let handleTyping = () => {};
      let isLive = false;
      if (item.handleTyping) {
        handleTyping = item.handleTyping; // eslint-disable-line prefer-destructuring
        isLive = true;
      }

      return {
        title: item.name,
        id: item.language,
        children: (
          <PrettyCode
            onKeyUp={event => handleTyping(event.target.innerText)}
            contentEditable={isLive}
            role="textbox"
            suppressContentEditableWarning
            tabInde={0}
            {...item}
          />
        ),
      };
    });

    return <TabbedPanel bleed="0" color="component" items={items} />;
  }
}

CodeBlock.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      language: PropTypes.string,
      code: PropTypes.string.isRequired,
      handleTyping: PropTypes.func,
    }),
  ).isRequired,
};

export default CodeBlock;
