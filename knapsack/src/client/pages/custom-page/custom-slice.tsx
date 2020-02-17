import React, { useRef, useEffect, useState } from 'react';
import cn from 'classnames';
import shortid from 'shortid';
import {
  KsButton,
  SchemaForm,
  KsPopover,
  KsDeleteButton,
  StatusMessage,
  Icon,
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
  const ref = useRef();
  const { isDragging } = useKsDragDrop({
    index: sliceIndex,
    ref,
    dragTypeId: 'custom-slice',
    handleDrop: ({ dragIndex }) => {
      moveSlice(sliceIndex, dragIndex);
    },
  });

  // Error handling for slices: if the error catcher gets an error, we set the error msg; then on the next data render we generate a new `key` so the slice component re-mounts completely
  const [errorMsg, setErrorMsg] = useState('');
  const keyRef = useRef(shortid.generate());
  useEffect(() => {
    if (errorMsg) {
      keyRef.current = shortid.generate();
      setErrorMsg('');
    }
  }, [slice]);

  const knapsackSlice = knapsackSlices.find(k => {
    return k.id === slice.blockId;
  });

  if (!knapsackSlice) {
    console.error(`Could not find slice!`, { slice, knapsackSlices });
    return <h2>Could not find slice id {slice.blockId}!</h2>;
  }

  const isFirstSlice = sliceIndex === 0;
  const isLastSlice = sliceIndex + 1 === slicesLength;

  const classes = cn('ks-custom-slice', {
    'ks-custom-slice--dragging': isDragging,
    'ks-custom-slice--can-edit': canEdit,
  });
  return (
    <aside ref={ref} className={classes}>
      {canEdit && (
        <div className="ks-custom-slice__controls">
          <div className="ks-custom-slice__handle">
            <Icon symbol="drag-handle" />
          </div>
          {!isFirstSlice && (
            <KsButton
              disabled={isFirstSlice}
              size="s"
              icon="up"
              handleTrigger={() => moveSliceUp(sliceIndex)}
            />
          )}
          {!isLastSlice && (
            <KsButton
              disabled={isLastSlice}
              size="s"
              icon="down"
              handleTrigger={() => moveSliceDown(sliceIndex)}
            />
          )}
          <KsDeleteButton
            size="s"
            flush
            handleTrigger={() => deleteSlice(sliceIndex)}
          />
          <KsPopover
            trigger="click"
            position="right"
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

                {knapsackSlice?.renderEditForm &&
                  knapsackSlice?.renderEditForm({
                    data: slice.data,
                    setSliceData: data => setSliceData(sliceIndex, data),
                    canEdit,
                  })}
              </>
            }
          >
            <KsButton size="s" icon="edit" kind="icon" flush>
              Edit
            </KsButton>
          </KsPopover>
        </div>
      )}

      <div className="ks-custom-slice__content">
        <CustomSliceErrorCatcher
          setErrorMsg={setErrorMsg}
          errorMsg={errorMsg}
          key={keyRef.current}
        >
          {knapsackSlice.render({
            data: slice.data,
            setSliceData: data => setSliceData(sliceIndex, data),
            canEdit,
          })}
        </CustomSliceErrorCatcher>
      </div>
    </aside>
  );
};

export default CustomSlice;
