import { useState, useEffect } from 'react';
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
