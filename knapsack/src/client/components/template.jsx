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
import PropTypes from 'prop-types';
import iframeResizer from 'iframe-resizer/js/iframeResizer'; // https://www.npmjs.com/package/iframe-resizer
import shortid from 'shortid';
import { KnapsackContext } from '../context';
import { getTemplateUrl } from '../data';
import './template.scss';

function Template({
  templateId,
  patternId,
  data = {},
  assetSetId,
  isResizable = false,
}) {
  const makeId = () => `${patternId}-${templateId}-${shortid.generate()}`;

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
      return () => {};
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

    return () => {
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
      let messageData = { path: '' }; // eslint-disable-line no-unused-vars
      try {
        messageData = JSON.parse(messageEvent.data);
      } catch (error) {
        console.warn(
          'Tried to parse JSON string from WebSocket message so Template can re-fetch new data.',
          { messageEvent, error },
        );
      }
      setId(makeId());
    });

    return () => {
      socket.close(1000, 'unmounting');
    };
  }, []);

  useEffect(() => {
    getTemplateUrl({
      patternId,
      templateId,
      data,
      assetSetId,
      isInIframe: true,
      wrapHtml: true,
      extraParams: { cacheBuster: id },
    })
      .then(setHtmlUrl)
      .catch(console.log.bind(console));
  }, [patternId, templateId, data, assetSetId]);

  const content = (
    <iframe
      style={{
        // Using min-width to set the width of the iFrame, works around an issue in iOS that can prevent the iFrame from sizing correctly
        width: '1px',
        minWidth: '100%',
        overflow: 'auto',
        verticalAlign: 'middle',
        border: 'none',
        // border: 'dotted 1px green',
      }}
      id={id}
      title={id}
      ref={iframeRef}
      src={htmlUrl}
    />
  );

  if (isResizable) {
    return (
      <div className="template__iframe-wrapper" ref={resizeRef}>
        <div className="template__resizable">
          {content}
          {width && (
            <div className="template__resiable__size-tab">{width}px</div>
          )}
        </div>
      </div>
    );
  }
  return content;
}

Template.defaultProps = {
  data: {},
  isResizable: true,
};

Template.propTypes = {
  templateId: PropTypes.string.isRequired,
  patternId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isResizable: PropTypes.bool,
};

export default Template;
