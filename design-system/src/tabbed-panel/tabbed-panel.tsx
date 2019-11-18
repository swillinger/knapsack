import React, { Component } from 'react';
import './tabbed-panel.scss';

type Item = {
  id: string;
  title: string;
  header?: React.ReactNode;
  children: JSX.Element;
  footer?: React.ReactNode;
  notes?: string;
};

type Props = {
  items: Item[];
  bleed?: string;
};

type State = {
  activeId: string;
};

export class TabbedPanel extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      activeId: props.items[0].id,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(item: Item): void {
    this.setState({
      activeId: item.id,
    });
  }

  render() {
    const { bleed = '30px' } = this.props;
    // @todo refactor these colors
    const colorTheme = 'var(--c-bg-dark)';
    const colorThemeAccent = 'var(--c-primary)';
    const tabs = this.props.items.map(item => {
      const isPropVariation = !!item.children.props.prop;
      return (
        <div
          className="ks-tabbed-panel__demo-tab"
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
            className="ks-tabbed-panel__header-region"
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
            className="ks-tabbed-panel__demo-stage"
            style={{
              padding: bleed,
            }}
          >
            {item.children}
            {item.notes && (
              <div
                className="ks-tabbed-panel__footer-region"
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
        <div className="ks-tabbed-panel__demo-tabs-wrap">{tabs}</div>
        <div
          className="ks-tabbed-panel__shadow-wrap"
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
