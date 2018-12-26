/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import iframeResizer from 'iframe-resizer/js/iframeResizer'; // https://www.npmjs.com/package/iframe-resizer
import { connectToContext, contextPropTypes } from '@basalt/bedrock-core';
import shortid from 'shortid';
import { IFrameWrapper } from './twig.styles';
import { apiUrlBase, gqlQuery } from '../../data';

const query = gql`
  query TemplateRender($patternId: ID!, $templateId: ID!, $data: JSON) {
    render(patternId: $patternId, templateId: $templateId, data: $data) {
      ok
      html
      message
    }
  }
`;

class Twig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      html: '',
      // detailsOpen: false, @todo preserve if `<details>` is open between renders
    };
    this.enableTemplatePush = props.context.features.enableTemplatePush;
    this.websocketsPort = props.context.meta.websocketsPort;
    this.apiEndpoint = `${apiUrlBase}`;
    this.id = `${this.props.templateId}-${
      this.props.patternId
    }-${shortid.generate()}`;
    this.iframeRef = React.createRef();
    this.getHtml = this.getHtml.bind(this);
  }

  componentDidMount() {
    this.getHtml(this.props.data);
    if (Object.prototype.hasOwnProperty.call(window, 'AbortController')) {
      this.controller = new window.AbortController();
      this.signal = this.controller.signal;
    }
    if (this.enableTemplatePush) {
      this.socket = new window.WebSocket(
        `ws://localhost:${this.websocketsPort}`,
      );

      // this.socket.addEventListener('open', event => {
      //   this.socket.send('Hello Server!', event);
      // });

      this.socket.addEventListener('message', data => {
        if (data.path.endsWith('css') || data.path.endsWith('js')) {
          // @todo determine why `this.getHtml()` won't pull down changed CSS, in the meantime, we'll do a full page reload
          window.location.reload();
        } else {
          this.getHtml(this.props.data);
        }
      });
    }
    const iframes = iframeResizer(
      {
        log: false,
        checkOrigin: [window.location.origin],
        autoResize: false, // When `true`, triggers resize when window changes size or when ANY DOM attribute changes.
      },
      this.iframeRef.current,
    );
    const [thisIframe] = iframes;
    if (thisIframe) {
      // `this.iframeResizer` can use all these callback methods: https://www.npmjs.com/package/iframe-resizer#callback-methods
      this.iframeResizer = thisIframe.iFrameResizer;
      // @todo Trigger resize only when needed. Temp stop-gap is to trigger a resize every second for now.
      this.resizerIntervalId = setInterval(() => {
        this.iframeResizer.resize();
      }, 1000);
    }
  }

  componentDidUpdate(prevProps) {
    const oldData = JSON.stringify(prevProps.data);
    const newData = JSON.stringify(this.props.data);
    const oldName = `${prevProps.templateId}-${prevProps.patternId}`;
    const newName = `${this.props.templateId}-${this.props.patternId}`;
    if (oldData !== newData) {
      this.getHtml(this.props.data);
    }
    if (oldName !== newName) {
      this.getHtml(this.props.data);
    }
  }

  componentWillUnmount() {
    if (
      Object.prototype.hasOwnProperty.call(window, 'AbortController') &&
      this.controller
    ) {
      this.controller.abort();
    }
    if (this.iframeResizer && typeof this.iframeResizer.close === 'function') {
      this.iframeResizer.close(); // https://github.com/davidjbradshaw/iframe-resizer/issues/576
    }
    clearInterval(this.resizerIntervalId);
    if (this.enableTemplatePush) {
      this.socket.close(1000, 'componentWillUnmount called');
    }
  }

  /**
   * @param {Object} templateData - Data to pass to template
   * @return {void}
   */
  getHtml(templateData) {
    gqlQuery({
      gqlQueryObj: query,
      variables: {
        templateId: this.props.templateId,
        patternId: this.props.patternId,
        data: templateData,
      },
    }).then(({ data, errors }) => {
      if (errors) {
        console.error(errors);
        this.setState({
          html: 'Error! See console',
        });
        return;
      }
      const { ok, html, message } = data.render;
      if (ok) {
        this.setState({
          html,
        });
        this.props.handleNewHtml(html);
      } else {
        this.setState({
          html: message,
        });
      }
    });
  }

  render() {
    let { html } = this.state;
    if (this.props.isDataShown) {
      const code = JSON.stringify(this.props.data, null, '  ');
      html = `${html}
        <details>
          <summary>Data Used</summary>
          <pre><code>${code}</code></pre>
        </details>`;
    }

    if (html && html.length > 32768) {
      // https://stackoverflow.com/a/19739077
      return (
        <div>
          There is too many characters in the html string to place in the iFrame
          using the <code>srcdoc</code> attribute. The max characters is 32,768
          and there were {html.length}.
        </div>
      );
    }

    const iframe = (
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
        id={this.id}
        title={this.id}
        ref={this.iframeRef}
        srcDoc={html}
      />
    );

    if (this.props.isResizable) {
      return (
        <IFrameWrapper onMouseUp={() => this.iframeResizer.resize()}>
          {iframe}
        </IFrameWrapper>
      );
    }
    return iframe;
  }
}

Twig.defaultProps = {
  data: {},
  isDataShown: false,
  handleNewHtml: () => {},
  isResizable: true,
};

Twig.propTypes = {
  templateId: PropTypes.string.isRequired,
  patternId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  context: contextPropTypes.isRequired,
  data: PropTypes.object,
  isDataShown: PropTypes.bool,
  handleNewHtml: PropTypes.func,
  isResizable: PropTypes.bool,
};

export default connectToContext(Twig);
