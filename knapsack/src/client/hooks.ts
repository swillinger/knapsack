import { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { useSelector } from './store';
import { WebSocketMessage } from '../schemas/web-sockets';

export { useValueDebounce } from '@knapsack/design-system';

export function useWebsocket(isNeeded = true) {
  const websocketsPort = useSelector(s => s.metaState.meta.websocketsPort);
  const [state, setState] = useState<{
    socket: WebSocket;
    sendMsg: (msg: WebSocketMessage) => void;
  }>({
    socket: null,
    sendMsg: () => {},
  });

  useEffect(() => {
    if (isNeeded) {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const newSocket = new window.WebSocket(
        `${protocol}://localhost:${websocketsPort}`,
      );
      newSocket.onopen = () => {
        const sendMsg = (msg: WebSocketMessage) => {
          newSocket.send(JSON.stringify(msg));
        };
        setState({
          socket: newSocket,
          sendMsg,
        });
      };
      return (): void => {
        newSocket.close(1000, 'unmounting');
      };
    }
  }, [isNeeded]);

  return state;
}

interface DragItem {
  index: number;
  type: string;
}

export function useKsDragDrop({
  dragTypeId,
  index,
  handleDrop,
  ref,
}: {
  dragTypeId: string;
  index: number;
  ref: React.MutableRefObject<HTMLDivElement>;
  handleDrop: ({ dragIndex: number }) => void;
}): {
  isDragging: boolean;
} {
  const [collectedProps, drop] = useDrop({
    accept: dragTypeId,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current!.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Dragging downwards
      // if (dragIndex < hoverIndex) {
      //   console.log('Dragging downwards');
      //   return;
      // }

      // // Dragging upwards
      // if (dragIndex > hoverIndex) {
      //   console.log('Dragging upwards');
      //   return;
      // }
      handleDrop({ dragIndex });

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: dragTypeId,
      index,
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return { isDragging };
}
