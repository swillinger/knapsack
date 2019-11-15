import React from 'react';
import shortid from 'shortid';
import { Button, SchemaForm } from '@knapsack/design-system';
import knapsackSlices from './slices';
// import { Slice } from './slices/types';
import { KnapsackCustomPageSlice } from '../../../schemas/custom-pages';

type Props = {
  slice: KnapsackCustomPageSlice;
  sliceIndex: number;
  isEditing: boolean;
  slicesLength: number;
  moveSliceDown: (index: number) => void;
  moveSliceUp: (index: number) => void;
  deleteSlice: (slideId: string) => void;
  setSliceData: (index: number, data: KnapsackCustomPageSlice['data']) => void;
};

type State = {
  hasError: boolean;
  errorMessage: string;
  renderKey: string;
};

class CustomSlice extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      renderKey: shortid.generate(),
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error({ error, errorInfo });
    this.setState({
      hasError: true,
      errorMessage: error.message,
    });
  }

  render() {
    const {
      slice,
      sliceIndex,
      isEditing,
      slicesLength,
      moveSliceDown,
      moveSliceUp,
      deleteSlice,
      setSliceData,
    } = this.props;

    const knapsackSlice = knapsackSlices.find(k => {
      return k.id === slice.blockId;
    });

    return (
      <aside
        className="custom-slice"
        style={{
          width: '100%',
          border: isEditing ? 'dotted 1px hsl(0, 0%, 45%)' : 'none',
          marginBottom: '.5rem',
          padding: '3px',
        }}
      >
        {isEditing && (
          <div>
            <h4>{knapsackSlice.title}</h4>
            <p>{knapsackSlice.description}</p>
            <Button
              disabled={sliceIndex === 0}
              onClick={() => moveSliceUp(sliceIndex)}
            >
              Move Up
            </Button>
            <Button
              disabled={sliceIndex + 1 === slicesLength}
              onClick={() => moveSliceDown(sliceIndex)}
            >
              Move Down
            </Button>
            <Button onClick={() => deleteSlice(slice.id)}>Delete Slice</Button>
            {knapsackSlice.schema && (
              <SchemaForm
                schema={knapsackSlice.schema}
                uiSchema={knapsackSlice.uiSchema || {}}
                formData={slice.data}
                onChange={({ formData }) => {
                  setSliceData(sliceIndex, formData);
                  if (this.state.hasError) {
                    this.setState({
                      renderKey: shortid.generate(),
                      hasError: false,
                      errorMessage: '',
                    });
                  }
                }}
              />
            )}
            <hr />
          </div>
        )}

        {this.state.hasError && (
          <>
            <h3>Error in component, please try changing data</h3>
            <p>{this.state.errorMessage}</p>
          </>
        )}

        {!this.state.hasError &&
          knapsackSlice &&
          knapsackSlice.render({
            data: slice.data,
            setSliceData: data => setSliceData(sliceIndex, data),
            isEditing,
            key: this.state.renderKey,
          })

        // <Slice
        //   data={slice.data}
        //   key={this.state.renderKey}
        //   setSliceData={data => setSliceData(sliceIndex, data)}
        //   isEditing={isEditing}
        // />
        }
      </aside>
    );
  }
}

export default CustomSlice;
