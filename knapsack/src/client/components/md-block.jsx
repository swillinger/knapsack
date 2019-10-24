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
import PropTypes from 'prop-types';
import marked from 'marked';
import { Button } from '@knapsack/atoms';
import './md-block.scss';

const MdBlock = ({ title, isEditable, md: initialMd, handleSave }) => {
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
    <div className="md-block">
      <div className="md-block__documentation-header">
        {title && <h4>{title}</h4>}
        {isEditable && (
          <Button
            onClick={() => {
              if (editing && handleSave) {
                handleSave(md);
              }
              setEditing(prevEditing => !prevEditing);
            }}
            style={{ marginLeft: 'auto' }}
          >
            {editing ? 'Save' : 'Edit'}
          </Button>
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

MdBlock.defaultProps = {
  isEditable: false,
  title: null,
  handleSave: null,
};

MdBlock.propTypes = {
  md: PropTypes.string.isRequired,
  isEditable: PropTypes.bool,
  title: PropTypes.string,
  handleSave: PropTypes.func,
};

export default MdBlock;
