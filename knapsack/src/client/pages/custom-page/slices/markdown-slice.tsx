import React from 'react';
import MdBlock from '../../../components/md-block';
import { Slice } from './types';

type Data = {
  md: string;
};

export const markdownSlice: Slice<Data> = {
  id: 'markdown-slice',
  title: 'Text',
  render: ({ canEdit, setSliceData, data }) => {
    return (
      <MdBlock
        md={data.md}
        handleChange={md => setSliceData({ md })}
        isEditorShown={canEdit}
      />
    );
  },
  initialData: {
    md: `
# A Heading

- A list of
- Things to
- Say about this
    `.trim(),
  },
};
