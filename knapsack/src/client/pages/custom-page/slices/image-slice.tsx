import React, { useState, useCallback, useRef } from 'react';
import {
  KsButton,
  KsFigure,
  useValueDebounce,
  KsGrid,
  Icon,
  KsDeleteButton,
  StatusMessage,
} from '@knapsack/design-system';
import arrayMove from 'array-move';
import cn from 'classnames';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { Slice } from './types';
import { uploadFile } from '../../../data';
import { InlineEditText } from '../../../components/inline-edit';
import { useKsDragDrop } from '../../../hooks';
import './image-slice.scss';

type Image = {
  caption?: string;
  src: string;
};

type Data = {
  imageSize?: 's' | 'm' | 'l';
  images?: Image[];
};

type Props = {
  image: Image;
  showControls: boolean;
  index: number;
  handleCaptionSave: (text: string) => void;
  move: (from: number, to: number) => void;
  handleDelete: () => void;
};

const ImageSliceImage: React.FC<Props> = ({
  image,
  index,
  showControls,
  handleCaptionSave,
  handleDelete,
  move,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { isDragging } = useKsDragDrop({
    ref,
    dragTypeId: 'image-slice-image',
    canDrag: showControls,
    index,
    handleDrop: ({ dragIndex }) => {
      move(dragIndex, index);
    },
  });

  return (
    <div
      style={{ opacity: isDragging ? 0 : 1 }}
      ref={ref}
      className="ks-image-slice__image"
    >
      <KsFigure
        figcaption={
          <>
            <InlineEditText
              text={image.caption}
              showControls={showControls}
              handleSave={handleCaptionSave}
            />
            {showControls && (
              <div className="ks-image-slice__image-controls">
                <div className="ks-image-slice__image-handle">
                  <Icon symbol="drag-handle" />
                </div>
                <KsDeleteButton flush size="s" handleTrigger={handleDelete} />
              </div>
            )}
          </>
        }
      >
        <img src={image.src} alt={image.caption} />
      </KsFigure>
    </div>
  );
};

async function handleFiles(
  files: File[],
): Promise<{ src: string; caption: string }[]> {
  const uploadedFiles = await Promise.all(
    files.map(async file => {
      const results = await uploadFile(file);
      if (!results.ok) {
        console.error('uh oh!', { results, file });
      }
      return results.data;
    }),
  );

  return uploadedFiles.map(file => {
    return {
      src: file.publicPath,
      caption: file.originalName,
    };
  });
}

const ImageSlice = ({
  canEdit,
  setSliceData,
  data = {},
}: import('./types').SliceRenderParams<Data>): JSX.Element => {
  // const [localData, setData] = useValueDebounce(data, setSliceData);
  // const [files, setFiles] = useState<
  //   ({
  //     preview: string;
  //   } & File)[]
  // >([]);
  const { images = [], imageSize = 'm' } = data;

  const onDrop = useCallback<DropzoneOptions['onDrop']>(async acceptedFiles => {
    // setFiles(
    //   acceptedFiles.map(file => ({
    //     ...file,
    //     preview: URL.createObjectURL(file),
    //   })),
    // );
    const uploadedImages = await handleFiles(acceptedFiles);
    setSliceData({
      images: [...uploadedImages, ...images],
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ['image/*'],
    multiple: true,
    noClick: true,
    noKeyboard: true,
  });
  // if (images.length === 0) return <h5>Not enough data to render...</h5>;
  const rootAttributes = canEdit ? getRootProps() : {};
  const inputProps = getInputProps();

  const classes = cn('ks-image-slice', {
    'ks-image-slice--dragging': isDragActive,
  });

  return (
    <div className={classes} {...rootAttributes}>
      {canEdit && isDragActive && (
        <div className="ks-image-slice__dropzone">
          <input {...inputProps} />
          <p>Drop images here to upload...</p>
        </div>
      )}
      <KsGrid itemSize={imageSize}>
        {images.map((image, index) => (
          <ImageSliceImage
            image={image}
            key={`${image.src}-${canEdit}`}
            index={index}
            showControls={canEdit}
            move={(from, to) => {
              setSliceData({
                images: arrayMove(images, from, to),
              });
            }}
            handleDelete={() => {
              setSliceData({
                images: images.filter((img, i) => index !== i),
              });
            }}
            handleCaptionSave={text => {
              setSliceData({
                images: images.map((img, i) => {
                  if (index !== i) return img;
                  return {
                    ...img,
                    caption: text,
                  };
                }),
              });
            }}
          />
        ))}
      </KsGrid>
    </div>
  );
};

export const imageSlice: Slice<Data> = {
  id: 'image-slice',
  title: 'Image Grid',
  description: 'Multiple images with captions laid out in a grid',
  render: props => <ImageSlice {...props} />,
  renderEditForm: ({ setSliceData, data }) => {
    return (
      <>
        <StatusMessage
          type="warning"
          message="Image uploading currently only works on localhost and is not currently set up for Cloud uploads"
        />
        <h5>Upload Images</h5>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={async e => {
            const files = Array.from(e.target.files);
            if (!files) return;
            const uploadedImages = await handleFiles(files);
            setSliceData({
              images: [...uploadedImages, ...data.images],
            });
          }}
        />
      </>
    );
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      imageSize: {
        title: 'Image Size',
        type: 'string',
        enum: ['s', 'm', 'l'],
        enumNames: ['small', 'medium', 'large'],
        default: 'm',
      },
    },
  },
};
