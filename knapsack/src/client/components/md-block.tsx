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
import React, { useState } from 'react';
import marked from 'marked';
import { KsButton } from '@knapsack/design-system';
import './md-block.scss';

type Props = {
  md: string;
  title?: string;
  handleSave?: (md: string) => void;
  isEditable?: boolean;
};

const MdBlock: React.FC<Props> = (props: Props) => {
  const { title, isEditable, md: initialMd, handleSave } = props;
  const [md, setMd] = useState(initialMd);
  const [editing, setEditing] = useState(false);

  if (!md) return null;
  const html = marked.parse(md.trim());
  let editArea;

  if (editing && isEditable) {
    editArea = (
      <textarea
        value={md}
        onChange={e => setMd(e.target.value)}
        style={{
          width: '50%',
        }}
      />
    );
  }

  return (
    <div className="ks-md-block">
      <div className="ks-md-block__documentation-header">
        {title && <h4>{title}</h4>}
        {isEditable && (
          <div style={{ marginLeft: 'auto' }}>
            <KsButton
              onClick={() => {
                if (editing && handleSave) {
                  handleSave(md);
                }
                setEditing(prevEditing => !prevEditing);
              }}
            >
              <>{editing ? 'Save' : 'Edit'}</>
            </KsButton>
          </div>
        )}
      </div>
      <div style={{ marginBottom: '10px', display: 'flex' }}>
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          style={{ width: editing ? '50%' : '100%' }}
        />
        {editArea}
      </div>
    </div>
  );
};

export default MdBlock;
