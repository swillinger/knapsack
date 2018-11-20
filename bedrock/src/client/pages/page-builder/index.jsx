import React, { Component } from 'react';
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import shortid from 'shortid';
import Spinner from '@basalt/bedrock-spinner';
import { StatusMessage } from '@basalt/bedrock-atoms';
import { connectToContext } from '@basalt/bedrock-core';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { apiUrlBase } from '../../data';
import PageWithSidebar from '../../layouts/page-with-sidebar';
import PlaygroundSlice from './page-builder-slice';
import PageBuilderSidebar, {
  SIDEBAR_DEFAULT,
  SIDEBAR_FORM,
  SIDEBAR_PATTERNS,
} from './page-builder-sidebar';
import { MainContent, StartInsertSlice } from './page-builder.styles';
import { BASE_PATHS } from '../../../lib/constants';

const query = gql`
  query PageBuilerPages($id: ID) {
    pageBuilderPage(id: $id) {
      id
      title
      path
      slices {
        id
        patternId
        data
      }
    }
  }
`;

class Playground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      example: null,
      slices: null,
      sidebarContent: SIDEBAR_DEFAULT,
      editFormInsertionIndex: null,
      editFormSchema: {},
      editFormUiSchema: {},
      editFormSliceId: null,
      filterTerm: '',
      statusMessage: '',
      statusType: 'info',
      hasVisibleControls: true,
      changeId: null,
    };
    // Static properties
    this.apiEndpoint = `${apiUrlBase}`;
    // Bindings
    this.moveSlice = this.moveSlice.bind(this);
    this.moveSliceUp = this.moveSliceUp.bind(this);
    this.moveSliceDown = this.moveSliceDown.bind(this);
    this.deleteSlice = this.deleteSlice.bind(this);
    this.handleHideEditForm = this.handleHideEditForm.bind(this);
    this.save = this.save.bind(this);
    this.getTemplateFromPatternId = this.getTemplateFromPatternId.bind(this);
    this.handleAddSlice = this.handleAddSlice.bind(this);
    this.handleEditFormChange = this.handleEditFormChange.bind(this);
    this.handleClearData = this.handleClearData.bind(this);
    this.handleCancelAddSlice = this.handleCancelAddSlice.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleFilterReset = this.handleFilterReset.bind(this);
    this.handleMetaFormChange = this.handleMetaFormChange.bind(this);
    this.handleStartInsertSlice = this.handleStartInsertSlice.bind(this);
    this.briefHighlight = this.briefHighlight.bind(this);
  }

  /**
   * @param {string} patternId - ID of Pattern, i.e. `media-block`
   * @return {{ name: string, selector: string, schema: Object, uiSchema: Object }} - First (main) template
   */
  getTemplateFromPatternId(patternId) {
    const pattern = this.props.patterns.find(p => p.id === patternId);
    // @todo Improve template grabbing method besides just "first" one
    if (pattern) {
      return pattern.templates[0];
    }
  }

  handleFilterReset() {
    this.setState({
      filterTerm: '',
    });
  }

  save() {
    const newExample = Object.assign({}, this.state.example, {
      slices: this.state.slices,
    });

    window
      // @todo write gql mutation here
      .fetch(`${this.apiEndpoint}${BASE_PATHS.PAGES}/${this.props.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExample),
      })
      .then(res => res.json())
      .then(results => {
        this.setState({
          statusMessage: results.message,
          statusType: results.ok ? 'success' : 'error',
        });
        setTimeout(() => {
          this.setState({
            statusMessage: '',
          });
        }, 3000);
      });
  }

  handleHideEditForm() {
    this.setState({
      editFormSliceId: null,
      sidebarContent: SIDEBAR_DEFAULT,
      changeId: null,
    });
  }

  /**
   * Move Slice
   * @param {number} fromIndex - Move this item
   * @param {number} toIndex - To this index
   * @param {string} id - Slice Id
   * @return {null} - sets state
   */
  moveSlice(fromIndex, toIndex, id) {
    this.setState(prevState => ({
      slices: arrayMove(prevState.slices, fromIndex, toIndex),
      editFormInsertionIndex: null,
    }));
    this.briefHighlight(id);
  }

  /**
   * @param {number} index - Index of item in `this.state.slices` to move up
   * @param {number} id - ID of item in `this.state.slices` to move up
   * @return {null} - sets state
   */
  moveSliceUp(index, id) {
    this.setState(prevState => ({
      slices: arrayMove(prevState.slices, index, index - 1),
      editFormInsertionIndex: null,
      sidebarContent: SIDEBAR_DEFAULT,
      editFormSliceId: null,
    }));
    this.briefHighlight(id);
  }

  /**
   * @param {number} index - Index of item in `this.state.slices` to move down
   * @param {number} id - ID of item in `this.state.slices` to move down
   * @return {null} - sets state
   */
  moveSliceDown(index, id) {
    this.setState(prevState => ({
      slices: arrayMove(prevState.slices, index, index + 1),
      editFormInsertionIndex: null,
      sidebarContent: SIDEBAR_DEFAULT,
      editFormSliceId: null,
    }));
    this.briefHighlight(id);
  }

  deleteSlice(sliceId) {
    this.setState(prevState => ({
      slices: prevState.slices.filter(slice => slice.id !== sliceId),
      sidebarContent: SIDEBAR_DEFAULT,
      editFormInsertionIndex: null,
    }));
    this.setState({
      statusMessage: 'Slice Deleted',
    });
    setTimeout(() => {
      this.setState({
        statusMessage: '',
      });
    }, 3000);
  }

  briefHighlight(sliceId) {
    this.setState({
      changeId: sliceId,
    });
    setTimeout(() => {
      this.setState({
        changeId: null,
      });
    }, 1000);
  }

  /**
   * @param {Object} patternId - a pattern id
   * @param {string} slice.id - unique id
   * @param {string} slice.patternId - ID of Pattern, i.e. `media-block`
   * @param {Object} slice.data - Data for Pattern,s usually `{}`
   * @returns {null} - sets state
   */
  handleAddSlice(patternId) {
    const { schema, uiSchema } = this.getTemplateFromPatternId(patternId);
    const id = shortid.generate();
    this.setState(prevState => {
      prevState.slices.splice(prevState.editFormInsertionIndex, 0, {
        id,
        patternId,
        data: schema.examples ? schema.examples[0] : {},
      });
      return {
        slices: prevState.slices,
        editFormSliceId: id,
        editFormSchema: schema,
        editFormUiSchema: uiSchema,
        sidebarContent: SIDEBAR_FORM,
        editFormInsertionIndex: null,
      };
    });
    this.briefHighlight(id);
    this.handleFilterReset();
  }

  handleStartInsertSlice(index) {
    this.setState({
      sidebarContent: SIDEBAR_PATTERNS,
      editFormInsertionIndex: index,
      editFormSliceId: null,
    });
  }

  handleEditFormChange(data) {
    this.setState(prevState => ({
      slices: prevState.slices.map(slice => {
        if (slice.id === prevState.editFormSliceId) {
          slice.data = data.formData;
        }
        return slice;
      }),
    }));
  }

  handleClearData() {
    this.setState(prevState => ({
      slices: prevState.slices.map(slice => {
        if (slice.id === prevState.editFormSliceId) {
          slice.data = {};
        }
        return slice;
      }),
    }));
  }

  handleCancelAddSlice() {
    this.setState({
      editFormSliceId: null,
      editFormInsertionIndex: null,
      sidebarContent: SIDEBAR_DEFAULT,
    });
  }

  handleFilterChange(event) {
    this.setState({ filterTerm: event.target.value });
  }

  handleMetaFormChange(formData) {
    this.setState(prevState => ({
      example: Object.assign({}, prevState.example, formData),
    }));
  }

  render() {
    if (!this.state.example) {
      return (
        <Query query={query} variables={{ id: this.props.id }}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner />;
            if (error) return <p>Error :(</p>;
            this.setState({
              example: data.pageBuilderPage,
              slices: data.pageBuilderPage.slices,
            });
            return null;
          }}
        </Query>
      );
    }
    const { props } = this;
    const SideBarContent = (
      <PageBuilderSidebar
        editFormSchema={this.state.editFormSchema}
        editFormUiSchema={this.state.editFormUiSchema}
        editFormSliceId={this.state.editFormSliceId}
        filterTerm={this.state.filterTerm}
        handleAddSlice={this.handleAddSlice}
        handleEditFormChange={this.handleEditFormChange}
        handleClearData={this.handleClearData}
        handleCancelAddSlice={this.handleCancelAddSlice}
        handleHideEditForm={this.handleHideEditForm}
        handleFilterChange={this.handleFilterChange}
        handleFilterReset={this.handleFilterReset}
        handleMetaFormChange={this.handleMetaFormChange}
        handleSave={this.save}
        metaFormData={this.state.example}
        patterns={this.props.patterns}
        sidebarContent={this.state.sidebarContent}
        slices={this.state.slices}
      />
    );
    return (
      <PageWithSidebar {...props} sidebar={SideBarContent}>
        <MainContent hasVisibleControls={this.state.hasVisibleControls}>
          {this.state.hasVisibleControls && (
            <React.Fragment>
              <h4 className="eyebrow">Prototyping Sandbox</h4>
              <h2>{this.state.example.title}</h2>

              {this.state.statusMessage && (
                <StatusMessage
                  message={this.state.statusMessage}
                  type={this.state.statusType}
                />
              )}
            </React.Fragment>
          )}
          <StartInsertSlice
            onClick={() => this.handleStartInsertSlice(0)}
            onKeyPress={() => this.handleStartInsertSlice(0)}
            hasVisibleControls={this.state.hasVisibleControls}
            isActive={this.state.editFormInsertionIndex === 0}
          >
            {this.state.editFormInsertionIndex === 0 ? (
              <h6>Select a component to add from the sidebar</h6>
            ) : (
              <h6>Click to Insert Content Here</h6>
            )}
          </StartInsertSlice>
          {this.state.slices.map((slice, sliceIndex) => {
            const template = this.getTemplateFromPatternId(slice.patternId);
            if (!template) {
              return (
                <div
                  key={`${slice.id}--fragment`}
                  onKeyPress={() => this.deleteSlice(slice.id)}
                  onClick={() => this.deleteSlice(slice.id)}
                  role="button"
                  aria-label="delete component"
                  tabIndex="0"
                >
                  <StatusMessage
                    message={`Template for "${
                      slice.patternId
                    }" not found. Click to delete.`}
                    type="warning"
                  />
                </div>
              );
            }
            return (
              <React.Fragment key={`${slice.id}--fragment`}>
                {template && (
                  <PlaygroundSlice
                    key={slice.id}
                    id={slice.id}
                    index={sliceIndex}
                    template={template.name}
                    data={slice.data}
                    showEditForm={() => {
                      this.setState({
                        editFormSliceId: slice.id,
                        editFormSchema: template.schema,
                        editFormUiSchema: template.uiSchema,
                        sidebarContent: SIDEBAR_FORM,
                        editFormInsertionIndex: null,
                      });
                      this.briefHighlight(slice.id);
                    }}
                    deleteMe={() => this.deleteSlice(slice.id)}
                    moveSlice={(dragIndex, hoverIndex) => {
                      console.log('moving...', { dragIndex, hoverIndex });
                      this.moveSlice(dragIndex, hoverIndex, slice.id);
                    }}
                    moveUp={() => this.moveSliceUp(sliceIndex, slice.id)}
                    moveDown={() => this.moveSliceDown(sliceIndex, slice.id)}
                    hasVisibleControls={this.state.hasVisibleControls}
                    isBeingEdited={this.state.editFormSliceId === slice.id}
                    isFirst={sliceIndex === 0}
                    isLast={this.state.slices.length - 1 === sliceIndex}
                    isChanged={this.state.changeId === slice.id}
                  />
                )}

                <StartInsertSlice
                  key={`${slice.id}--handleAddSlice`}
                  onClick={() => this.handleStartInsertSlice(sliceIndex + 1)}
                  onKeyPress={() => this.handleStartInsertSlice(sliceIndex + 1)}
                  hasVisibleControls={this.state.hasVisibleControls}
                  isActive={
                    this.state.editFormInsertionIndex === sliceIndex + 1
                  }
                >
                  {this.state.editFormInsertionIndex === sliceIndex + 1 ? (
                    <h6>Select a component to add from the sidebar</h6>
                  ) : (
                    <h6>Click to Insert Content Here</h6>
                  )}
                </StartInsertSlice>
              </React.Fragment>
            );
          })}
        </MainContent>
      </PageWithSidebar>
    );
  }
}

Playground.propTypes = {
  // context: contextPropTypes.isRequired,
  patterns: PropTypes.array.isRequired, // eslint-disable-line
  example: PropTypes.object.isRequired, // eslint-disable-line
  id: PropTypes.string.isRequired, // @todo save/show playgrounds based on `id`
};

export default DragDropContext(HTML5Backend)(connectToContext(Playground));
