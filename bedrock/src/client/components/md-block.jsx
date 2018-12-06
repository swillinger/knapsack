import React from 'react';
import PropTypes from 'prop-types';
import md from 'marked';
import styled from 'styled-components';
import { Button } from '@basalt/bedrock-atoms';

const DocumentationWrapper = styled.div`
  margin-bottom: 2rem;
`;

const DocumentationHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default class MdBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      md: props.md,
      editing: false,
    };
    this.handleEditingToggle = this.handleEditingToggle.bind(this);
  }

  handleEditingToggle() {
    const { handleSave } = this.props;
    const { editing, md: markdown } = this.state;
    /* Toggling "editing" state to false implies a save */
    if (editing && handleSave) {
      handleSave(markdown);
    }
    this.setState(prevState => ({ editing: !prevState.editing }));
  }

  render() {
    if (!this.props.md) return null;
    const { title, isEditable } = this.props;
    const { editing } = this.state;
    const html = md.parse(this.state.md);
    let editArea;

    if (editing && isEditable) {
      editArea = (
        <textarea
          value={this.state.md}
          onChange={e => {
            this.setState({ md: e.target.value });
          }}
          style={{
            width: '50%',
          }}
        />
      );
    }

    return (
      <DocumentationWrapper>
        <DocumentationHeader>
          {title && <h4>{title}</h4>}
          {isEditable && (
            <Button onClick={this.handleEditingToggle}>
              {editing ? 'Save' : 'Edit'}
            </Button>
          )}
        </DocumentationHeader>
        <div style={{ marginBottom: '10px', display: 'flex' }}>
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ width: editing ? '50%' : '100%' }}
          />
          {editArea}
        </div>
      </DocumentationWrapper>
    );
  }
}

MdBlock.defaultProps = {
  isEditable: false,
  title: null,
  handleSave: null,
};

MdBlock.propTypes = {
  md: PropTypes.string.isRequired,
  isEditable: PropTypes.bool,
  title: PropTypes.string,
  handleSave: PropTypes.func,
};
