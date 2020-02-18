import React, { useRef, useEffect, useState, useMemo } from 'react';
import cn from 'classnames';
import shortid from 'shortid';
import {
  KsButton,
  SchemaForm,
  KsPopover,
  KsDeleteButton,
  StatusMessage,
  Icon,
  useHover,
} from '@knapsack/design-system';
import knapsackSlices from './slices';
// import { Slice } from './slices/types';
import { KnapsackCustomPageSlice } from '../../../schemas/custom-pages';
import './custom-slice.scss';
import { useKsDragDrop } from '../../hooks';

type ErrorCatcherProps = {
  children: React.ReactNode;
  errorMsg: string;
  setErrorMsg: (errorMsg: string) => void;
};

class CustomSliceErrorCatcher extends React.Component<ErrorCatcherProps> {
  componentDidCatch(error, errorInfo) {
    console.error({ error, errorInfo });
    this.props.setErrorMsg(error.message);
  }

  render() {
    if (!this.props.errorMsg) return this.props.children;

    return (
      <StatusMessage type="error">
        <h3>Error in component, please try changing data</h3>
        <p>{this.props.errorMsg}</p>
      </StatusMessage>
    );
  }
}

type Props = {
  slice: KnapsackCustomPageSlice;
  sliceIndex: number;
  canEdit: boolean;
  slicesLength: number;
  moveSlice: (from: number, to: number) => void;
  moveSliceDown: (index: number) => void;
  moveSliceUp: (index: number) => void;
  deleteSlice: (index: number) => void;
  setSliceData: (index: number, data: KnapsackCustomPageSlice['data']) => void;
};

const CustomSlice: React.FC<Props> = ({
  slice,
  sliceIndex,
  canEdit,
  slicesLength,
  moveSlice,
  moveSliceDown,
  moveSliceUp,
  deleteSlice,
  setSliceData,
}: Props) => {
  // Start: Drag/Drop
  const ref = useRef();
  const { isDragging } = useKsDragDrop({
    index: sliceIndex,
    ref,
    dragTypeId: 'custom-slice',
    handleDrop: ({ dragIndex }) => {
      moveSlice(sliceIndex, dragIndex);
    },
  });
  // Stop: Drag/Drop

  // Start: Error handling for slices
  // If the error catcher gets an error, we set the error msg; then on the next data render we generate a new `key` so the slice component re-mounts completely
  const [errorMsg, setErrorMsg] = useState('');
  const keyRef = useRef(shortid.generate());
  useEffect(() => {
    if (errorMsg) {
      keyRef.current = shortid.generate();
      setErrorMsg('');
    }
  }, [slice]);
  // Stop: Error handling for slices

  // Start: Edit UI
  const [isEditPopoverOpen, setEditPopOverOpen] = useState(false);
  const [hoverRef, isHovered] = useHover(ref);
  // Stop: Edit UI

  const [state, setState] = useState<any>();
  const knapsackSlice = knapsackSlices.find(k => {
    return k.id === slice.blockId;
  });

  const renderParams = {
    data: slice.data ?? {},
    setSliceData: data => setSliceData(sliceIndex, data),
    canEdit,
    state,
    setState,
  };

  // This ensures the slice itself only re-renders when it's props change
  const theSlice = useMemo(() => {
    return knapsackSlice.render(renderParams);
  }, [renderParams.data, renderParams.state]);

  if (!knapsackSlice) {
    console.error(`Could not find slice!`, {
      slice,
      knapsackSlices,
    });
    return <h2>Could not find slice id {slice.blockId}!</h2>;
  }

  const isFirstSlice = sliceIndex === 0;
  const isLastSlice = sliceIndex + 1 === slicesLength;
  // UI is visible if slice is hovered - and ALWAYS visible if the edit popover is open
  const isEditUiVisible = (canEdit && isHovered) || isEditPopoverOpen;
  const hasEditForm = !!knapsackSlice.schema || !!knapsackSlice.renderEditForm;

  const classes = cn('ks-custom-slice', {
    'ks-custom-slice--dragging': isDragging,
    'ks-custom-slice--can-edit': canEdit,
    'ks-custom-slice--edit-ui-visible': isEditUiVisible,
  });

  return (
    <aside ref={hoverRef} className={classes}>
      <div className="ks-custom-slice__content-wrapper">
        {canEdit && (
          <div className="ks-custom-slice__controls">
            <div className="ks-custom-slice__handle">
              <Icon symbol="drag-handle" />
            </div>
            {!isFirstSlice && (
              <div className="ks-custom-slice__move --move-up">
                <KsButton
                  kind="icon"
                  disabled={isFirstSlice}
                  size="s"
                  icon="move-item-up"
                  flush
                  handleTrigger={() => moveSliceUp(sliceIndex)}
                />
              </div>
            )}
            {!isLastSlice && (
              <div className="ks-custom-slice__move --move-down">
                <KsButton
                  kind="icon"
                  disabled={isLastSlice}
                  size="s"
                  icon="move-item-down"
                  flush
                  handleTrigger={() => moveSliceDown(sliceIndex)}
                />
              </div>
            )}
            <div className="ks-custom-slice__slice-actions">
              {hasEditForm && (
                <div className="ks-custom-slice__edit-btn">
                  <KsPopover
                    trigger="prop"
                    position="right"
                    maxWidth={360}
                    isOpen={isEditPopoverOpen}
                    onClickOutside={() => setEditPopOverOpen(false)}
                    content={
                      <>
                        <h4>{knapsackSlice.title}</h4>
                        {knapsackSlice.schema && (
                          <SchemaForm
                            schema={knapsackSlice.schema}
                            uiSchema={knapsackSlice.uiSchema || {}}
                            formData={slice.data}
                            onChange={({ formData }) => {
                              setSliceData(sliceIndex, formData);
                            }}
                          />
                        )}

                        {knapsackSlice?.renderEditForm(renderParams)}
                      </>
                    }
                  >
                    <KsButton
                      size="s"
                      icon="edit"
                      kind="icon"
                      flush
                      handleTrigger={() => setEditPopOverOpen(is => !is)}
                    >
                      Edit
                    </KsButton>
                  </KsPopover>
                </div>
              )}
              <div className="ks-custom-slice__delete-btn">
                <KsDeleteButton
                  size="s"
                  flush
                  handleTrigger={() => deleteSlice(sliceIndex)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="ks-custom-slice__content">
          <CustomSliceErrorCatcher
            setErrorMsg={setErrorMsg}
            errorMsg={errorMsg}
            key={keyRef.current}
          >
            {theSlice}
          </CustomSliceErrorCatcher>
        </div>
      </div>
    </aside>
  );
};

export default CustomSlice;
