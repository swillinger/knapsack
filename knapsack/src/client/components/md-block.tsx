/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import React from 'react';
import { useValueDebounce, CodeSnippet } from '@knapsack/design-system';
import ReactMarkdown from 'react-markdown';
import { SuspenseLoader } from './suspense-loader';
import './md-block.scss';
import 'easymde/dist/easymde.min.css';

// https://github.com/RIP21/react-simplemde-editor
const SimpleMDE = React.lazy(() => import('react-simplemde-editor'));

type Props = {
  md: string;
  title?: string;
  handleChange?: (md: string) => void;
  isEditorShown?: boolean;
};

const MdBlock: React.FC<Props> = ({
  title,
  md: initialMd,
  handleChange,
  isEditorShown,
}: Props) => {
  const [md, setMd] = useValueDebounce(initialMd, handleChange);
  if (!md) return null;

  return (
    <div className="ks-md-block">
      <div className="ks-md-block__documentation-header">
        {title && <h4>{title}</h4>}
      </div>
      {isEditorShown && (
        <SuspenseLoader>
          <SimpleMDE
            onChange={value => {
              setMd(value);
            }}
            value={md}
            // https://github.com/Ionaru/easy-markdown-editor#configuration
            options={{
              // autoDownloadFontAwesome: false,
              indentWithTabs: false,
              promptURLs: true,
            }}
          />
        </SuspenseLoader>
      )}
      {!isEditorShown && (
        <ReactMarkdown
          source={md.trim()}
          renderers={{
            code: ({ language, value }) => (
              <CodeSnippet code={value} language={language} />
            ),
          }}
        />
      )}
    </div>
  );
};

export default MdBlock;
