import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ClearFilterButton,
  TypeToFilter,
  TypeToFilterInputWrapper,
} from '@basalt/bedrock-atoms';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import PageBuilderEditForm from './page-builder-edit-form';
import PlaygroundSidebarPatternListItem from './page-builder-pattern-list-item';
import {
  PatternListWrapper,
  PlaygroundStyledSchemaForm,
} from './page-builder.styles';
import { BASE_PATHS } from '../../../lib/constants';

// Export of allowed sidebarContent states
export const SIDEBAR_DEFAULT = 'default';
export const SIDEBAR_FORM = 'form';
export const SIDEBAR_PATTERNS = 'patterns';

function PageBuilderSidebar(props) {
  if (props.sidebarContent === SIDEBAR_FORM) {
    const { slices, editFormSliceId, editFormSchema, editFormUiSchema } = props;
    return (
      <PageBuilderEditForm
        schema={editFormSchema}
        uiSchema={editFormUiSchema}
        data={slices.find(s => s.id === editFormSliceId).data}
        handleChange={data => props.handleEditFormChange(data)}
        handleError={console.error}
        handleHideEditForm={props.handleHideEditForm}
        handleClearData={data => props.handleClearData(data)}
      />
    );
  }
  if (props.sidebarContent === SIDEBAR_PATTERNS) {
    const patterns = props.patterns.filter(pattern =>
      pattern.meta.uses.includes('inSlice'),
    );
    const items =
      props.filterTerm === ''
        ? patterns
        : patterns.filter(
            item =>
              item.meta.title
                .toLowerCase()
                .search(props.filterTerm.toLowerCase()) !== -1,
          );

    return (
      <div>
        <h4>Patterns</h4>
        <TypeToFilter>
          <h6 className="eyebrow">Filter List</h6>
          <TypeToFilterInputWrapper>
            <input
              type="text"
              className="type-to-filter"
              placeholder="Type to filter..."
              value={props.filterTerm}
              onChange={event => props.handleFilterChange(event)}
            />
            <ClearFilterButton
              role="button"
              onClick={props.handleFilterReset}
              onKeyPress={props.handleFilterReset}
              isVisible={!!props.filterTerm}
            >
              <FaTimes />
            </ClearFilterButton>
          </TypeToFilterInputWrapper>
        </TypeToFilter>
        <PatternListWrapper>
          {items.map(pattern => (
            <PlaygroundSidebarPatternListItem
              key={pattern.id}
              pattern={pattern}
              handleAddSlice={props.handleAddSlice}
            />
          ))}
        </PatternListWrapper>

        <Button
          onClick={props.handleCancelAddSlice}
          onKeyPress={props.handleCancelAddSlice}
          type="button"
          className="button button--color-white button--size-small"
        >
          Cancel
        </Button>
      </div>
    );
  }

  // if (props.sidebarContent === SIDEBAR_DEFAULT or anything else)
  return (
    <div>
      <h4>Page Builder</h4>
      <PlaygroundStyledSchemaForm
        onChange={({ formData }) => props.handleMetaFormChange(formData)}
        formData={props.metaFormData}
        schema={{
          title: 'Metadata',
          type: 'object',
          properties: {
            title: {
              title: 'Page Title',
              type: 'string',
            },
            description: {
              title: 'Description',
              type: 'string',
            },
            hasVisibleControls: {
              title: 'Show Edit Controls',
              type: 'boolean',
              default: true,
            },
          },
        }}
        uiSchema={{
          description: {
            'ui:widget': 'textarea',
            'ui:options': {
              rows: 10,
            },
          },
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          type="submit"
          onKeyPress={() => props.handleSave()}
          onClick={() => props.handleSave()}
          primary
        >
          Save
        </Button>
        <Link to={BASE_PATHS.PAGES}>Back</Link>
      </div>
    </div>
  );
}

PageBuilderSidebar.propTypes = {
  editFormSchema: PropTypes.object.isRequired,
  editFormUiSchema: PropTypes.object.isRequired,
  editFormSliceId: PropTypes.string.isRequired,
  filterTerm: PropTypes.string.isRequired,
  handleAddSlice: PropTypes.func.isRequired,
  handleEditFormChange: PropTypes.func.isRequired,
  handleClearData: PropTypes.func.isRequired,
  handleCancelAddSlice: PropTypes.func.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  handleFilterReset: PropTypes.func.isRequired,
  handleHideEditForm: PropTypes.func.isRequired,
  handleMetaFormChange: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  metaFormData: PropTypes.object.isRequired,
  patterns: PropTypes.arrayOf(PropTypes.object).isRequired,
  sidebarContent: PropTypes.string.isRequired,
  slices: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PageBuilderSidebar;
