import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getTypeColor } from '@knapsack/core';
import './tabbed-panel.scss';

class TabbedPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeId: props.items[0].id,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(item) {
    this.setState({
      activeId: item.id,
    });
  }

  render() {
    const colorTheme = getTypeColor(this.props.color);
    const colorThemeAccent = getTypeColor(this.props.color, 'accent');
    const tabs = this.props.items.map(item => {
      const isPropVariation = !!item.children.props.prop;
      return (
        <div
          className="tabbed-panel__demo-tab"
          key={item.id}
          role="button"
          tabIndex={0}
          onClick={() => this.handleClick(item)}
          onKeyUp={() => this.handleClick(item)}
          style={{
            borderBottom:
              this.state.activeId === item.id
                ? `5px solid ${colorTheme}`
                : '5px solid transparent',
            color: this.state.activeId === item.id ? colorTheme : 'black',
            zIndex: this.state.activeId === item.id ? 1 : 0,
            fontWeight: this.state.activeId === item.id ? 'bold' : 'normal',
          }}
        >
          {isPropVariation ? item.children.props.prop.title : item.title}
        </div>
      );
    });

    const content = this.props.items.map(item => (
      <div
        key={item.id}
        style={{
          display: this.state.activeId === item.id ? 'block' : 'none',
        }}
      >
        {item.header && (
          <div
            className="tabbed-panel__header-region"
            style={{
              background: colorThemeAccent,
              borderBottom: `10px solid ${colorTheme}`,
            }}
          >
            {item.header}
          </div>
        )}
        {item.children && (
          <div
            className="tabbed-panel__demo-stage"
            style={{
              padding: this.props.bleed,
            }}
          >
            {item.children}
            {item.notes && (
              <div
                className="tabbed-panel__footer-region"
                colorTheme={colorTheme}
                style={{
                  borderTop: `1px solid ${colorTheme}`,
                }}
              >
                <h5 style={{ color: colorTheme }}>Notes</h5>
                {item.notes}
              </div>
            )}
          </div>
        )}
      </div>
    ));
    return (
      <div>
        <div className="tabbed-panel__demo-tabs-wrap">{tabs}</div>
        <div
          className="tabbed-panel__shadow-wrap"
          style={{
            borderColor: colorTheme,
          }}
        >
          {content}
        </div>
      </div>
    );
  }
}

TabbedPanel.defaultProps = {
  color: 'none',
  // type: 'none',
  bleed: '30px',
};

TabbedPanel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      header: PropTypes.node,
      children: PropTypes.node.isRequired,
      footer: PropTypes.node,
    }),
  ).isRequired,
  color: PropTypes.string,
  bleed: PropTypes.string,
  // type: PropTypes.string,
};

export default TabbedPanel;
