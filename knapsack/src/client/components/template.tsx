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
import { CircleSpinner } from '@knapsack/design-system';
import iframeResizer from 'iframe-resizer/js/iframeResizer'; // https://www.npmjs.com/package/iframe-resizer
import shortid from 'shortid';
import { getTemplateInfo } from '../data';
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
import { KsRenderResults } from '../../schemas/knapsack-config';
import { useSelector } from '../store';
import { useWebsocket } from '../hooks';
import ErrorCatcher from '../utils/error-catcher';

export type Props = {
  patternId: string;
  templateId: string;
  assetSetId?: string;
  // data?: KnapsackTemplateData;
  demo: KnapsackTemplateDemo;
  isResizable?: boolean;
  handleTemplateInfo?: (info: KsRenderResults & { url: string }) => void;
};

const Template: React.FC<Props> = ({
  templateId,
  patternId,
  demo,
  assetSetId,
  isResizable = true,
  handleTemplateInfo = () => {},
}: Props) => {
  const makeId = (): string =>
    `${patternId}-${templateId}-${shortid.generate()}`;

  const [id, setId] = useState(makeId());
  const [htmlUrl, setHtmlUrl] = useState('');
  const [width, setWidth] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const resizeRef = useRef(null);
  const templatePush = useSelector(s => s.userState.features.templatePush);
  const { socket } = useWebsocket(templatePush);

  if (socket && templatePush) {
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
  }

  // Setup iFrame Resizer
  useEffect(() => {
    const iframes = iframeResizer(
      {
        log: false,
        checkOrigin: [window.location.origin],
        autoResize: true, // When `true`, triggers resize when window changes size or when ANY DOM attribute changes.
        resizeFrom: 'child',
        onResized: ({ width: newWidth }) => {
          setWidth(newWidth);
        },
        onMessage: ({ message }) => {
          if (message?.type === 'event') {
            if (message?.event === 'ready') {
              // the template has loaded
              setIsReady(true);
            }
          }
        },
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

    return (): void => {
      if (thisIframeResizer && typeof thisIframeResizer.close === 'function') {
        thisIframeResizer.close(); // https://github.com/davidjbradshaw/iframe-resizer/issues/576
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    // begins a countdown when 'val' changes. if it changes before countdown
    // ends, clear the timeout avoids lodash debounce to avoid stale
    // values in globalSet.
    const timeout = setTimeout(() => {
      setIsReady(false);
      getTemplateInfo({
        patternId,
        templateId,
        demo,
        assetSetId: demo?.assetSetId ?? assetSetId,
        isInIframe: true,
        wrapHtml: true,
        extraParams: { cacheBuster: id },
      })
        .then(info => {
          if (isMounted) {
            handleTemplateInfo(info);
            setHtmlUrl(info.url);
          }
        })
        .catch(console.log.bind(console));
    }, 175);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [patternId, templateId, demo, assetSetId, id]);

  let content = (
    <ErrorCatcher>
      <iframe
        className="ks-template__iframe"
        title={id}
        ref={iframeRef}
        src={htmlUrl}
      />
    </ErrorCatcher>
  );

  if (isResizable) {
    content = (
      <div className="ks-template__iframe-wrapper" ref={resizeRef}>
        <div className="ks-template__resizable">
          {content}
          {width && (
            <div className="ks-template__resizable__size-reading">
              {width}px
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div
      className={`ks-template ks-template--${isReady ? `ready` : `not-ready`}`}
    >
      {!isReady && (
        <div className="ks-template__spinner">
          <CircleSpinner size="2em" />
        </div>
      )}
      {content}
    </div>
  );
};

export default Template;
