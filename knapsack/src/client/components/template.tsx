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
import React, { useState, useEffect, useRef, useContext } from 'react';
import iframeResizer from 'iframe-resizer/js/iframeResizer'; // https://www.npmjs.com/package/iframe-resizer
import shortid from 'shortid';
import { KnapsackContext } from '../context';
import { getTemplateUrl } from '../data';
import {
  WS_EVENTS,
  PatternChangedData,
  AssetChangedData,
  WebSocketMessage,
} from '../../schemas/web-sockets';
import './template.scss';
import {
  KnapsackTemplateData,
  KnapsackTemplateDemo,
} from '../../schemas/patterns';

type Props = {
  patternId: string;
  templateId: string;
  assetSetId?: string;
  // data?: KnapsackTemplateData;
  demo: KnapsackTemplateDemo;
  isResizable?: boolean;
};

const Template: React.FC<Props> = ({
  templateId,
  patternId,
  demo,
  assetSetId,
  isResizable = true,
}: Props) => {
  const makeId = (): string =>
    `${patternId}-${templateId}-${shortid.generate()}`;

  const [id, setId] = useState(makeId());
  const [htmlUrl, setHtmlUrl] = useState('/api/loading');
  const [width, setWidth] = useState(null);
  const iframeRef = useRef(null);
  const resizeRef = useRef(null);
  const {
    meta: { websocketsPort },
  } = useContext(KnapsackContext);

  // Setup iFrame Resizer
  useEffect(() => {
    const iframes = iframeResizer(
      {
        log: false,
        checkOrigin: [window.location.origin],
        autoResize: false, // When `true`, triggers resize when window changes size or when ANY DOM attribute changes.
      },
      iframeRef.current,
    );
    const [thisIframe] = iframes;
    if (!thisIframe) {
      return (): void => {};
    }

    setWidth(iframeRef.current.offsetWidth);

    // can use all these callback methods: https://www.npmjs.com/package/iframe-resizer#callback-methods
    const thisIframeResizer = thisIframe.iFrameResizer;
    // @todo Trigger resize only when needed. Temp stop-gap is to trigger a resize every second for now.
    const resizerIntervalId = setInterval(() => {
      thisIframeResizer.resize();
      if (isResizable) {
        const newWidth = iframeRef.current.offsetWidth;
        if (width !== newWidth) {
          setWidth(newWidth);
        }
      }
    }, 1000);

    return (): void => {
      if (thisIframeResizer && typeof thisIframeResizer.close === 'function') {
        thisIframeResizer.close(); // https://github.com/davidjbradshaw/iframe-resizer/issues/576
      }
      clearInterval(resizerIntervalId);
    };
  }, []);

  // Setup WebSockets for refreshing page when templates change
  useEffect(() => {
    if (!websocketsPort) {
      return;
    }
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new window.WebSocket(
      `${protocol}://localhost:${websocketsPort}`,
    );
    socket.addEventListener('message', messageEvent => {
      // let messageData = { event: '' }; // eslint-disable-line no-unused-vars
      let messageData: WebSocketMessage;
      try {
        messageData = JSON.parse(messageEvent.data);
      } catch (error) {
        console.warn(
          'Tried to parse JSON string from WebSocket message so Template can re-fetch new data.',
          { messageEvent, error },
        );
      }
      if (!messageData) return;

      switch (messageData.event) {
        case WS_EVENTS.PATTERN_TEMPLATE_CHANGED:
          // console.log(WS_EVENTS.PATTERN_TEMPLATE_CHANGED);
          setId(makeId());
          break;
        case WS_EVENTS.PATTERN_ASSET_CHANGED:
          // console.log(WS_EVENTS.PATTERN_ASSET_CHANGED);
          setId(makeId());
          break;
        default:
          console.log('ws default');
      }
    });

    return (): void => {
      socket.close(1000, 'unmounting');
    };
  }, []);

  useEffect(() => {
    getTemplateUrl({
      patternId,
      templateId,
      demo,
      assetSetId,
      isInIframe: true,
      wrapHtml: true,
      extraParams: { cacheBuster: id },
    })
      .then(setHtmlUrl)
      .catch(console.log.bind(console));
  }, [patternId, templateId, demo, assetSetId, id]);

  const content = (
    <iframe
      className="ks-template__iframe"
      id={id}
      title={id}
      ref={iframeRef}
      src={htmlUrl}
    />
  );

  if (isResizable) {
    return (
      <div className="ks-template__iframe-wrapper" ref={resizeRef}>
        <div className="ks-template__resizable">
          {content}
          {width && (
            <div className="ks-template__resizable__size-tab">{width}px</div>
          )}
        </div>
      </div>
    );
  }
  return <aside className="ks-template">{content}</aside>;
};

export default Template;
