import React, { useState, useRef } from 'react';
import { Icon, KsButton, KsDeleteButton } from '@knapsack/design-system';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { InlineEditText } from '../../../../components/inline-edit';
import { SpecItemTypes } from './shared';
import './spec-item.scss';
import { useKsDragDrop } from '../../../../hooks';

interface DragItem {
  index: number;
  id: string;
  type: keyof typeof SpecItemTypes;
}

type SpecItemProps = {
  index: number;
  id: string;
  type: keyof typeof SpecItemTypes;
  children: React.ReactNode;
  moveItem: (from: number, to: number) => void;
  deleteItem: (index: number) => void;
  handleNewId: (newTitle: string) => void;
  isInitiallyOpen?: boolean;
};

export const KsSpecItem: React.FC<SpecItemProps> = ({
  id,
  children,
  type,
  moveItem,
  deleteItem,
  index,
  handleNewId,
  isInitiallyOpen = false,
}: SpecItemProps) => {
  const [isOpen, setOpen] = useState(isInitiallyOpen);
  const ref = useRef<HTMLDivElement>(null);
  const { isDragging } = useKsDragDrop({
    dragTypeId: SpecItemTypes[type],
    index,
    ref,
    handleDrop: ({ dragIndex }) => {
      moveItem(dragIndex, index);
    },
  });

  const opacity = isDragging ? 0 : 1;

  return (
    <div
      ref={ref}
      className={`ks-spec-item ${isDragging ? 'ks-spec-item--dragging' : ''}`}
      style={{ marginBottom: 'var(--space-xs)', opacity }}
    >
      <header
        className="ks-spec-item__header"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: 'var(--space-xs)',
          borderBottom: isOpen ? 'var(--c-frame)' : '',
          backgroundColor: 'var(--c-shade)',
        }}
      >
        <div className="ks-spec-item__handle">
          <Icon symbol="drag-handle" />
        </div>
        <h4 className="ks-spec-item__title" style={{ marginTop: '0' }}>
          <InlineEditText showControls text={id} handleSave={handleNewId} />
        </h4>
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <KsDeleteButton
            flush
            size="s"
            handleTrigger={() => deleteItem(index)}
          />
          <div
            style={{
              transform: isOpen ? '' : 'rotate(90deg)',
              transition: 'transform .15s ease-in',
              marginLeft: 'var(--space-xs)',
            }}
          >
            <KsButton
              icon="collapser"
              size="m"
              flush
              kind="icon"
              handleTrigger={() => setOpen(isO => !isO)}
            />
          </div>
        </div>
      </header>
      <div
        className="ks-spec-item__body ks-u-shade-bg"
        style={{
          display: isOpen ? 'block' : 'none',
          padding: 'var(--space-xs)',
          backgroundColor: 'var(--c-shade)',
        }}
      >
        {children}
      </div>
    </div>
  );
};
