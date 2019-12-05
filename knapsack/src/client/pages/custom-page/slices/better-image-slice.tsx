import React from 'react';
import { Storage } from 'aws-amplify';
import { S3Image, PhotoPicker } from 'aws-amplify-react';
import { Slice, SliceRenderParams } from './types';

type SliceData = {
  imgKey?: string;
};

type Props = SliceRenderParams<SliceData>;

export const BetterImageSlice: React.FC<Props> = ({
  setSliceData,
  isEditing,
  data,
}: Props) => {
  // console.log('data', data);
  return (
    <div className="ks-u-amplify-wrapper">
      {data?.imgKey && <img src={data.imgKey} alt="" />}
      {isEditing && (
        <S3Image
          picker
          onLoad={dataUrl => {
            // console.log({ dataUrl });
            setSliceData({
              imgKey: dataUrl,
            });
          }}
        />
      )}
    </div>
  );
};

export const betterImageSlice: Slice<SliceData> = {
  id: 'better-image-slice',
  title: 'User Image Slice',
  description: 'Upload images from user',
  render: props => <BetterImageSlice {...props} />,
};
