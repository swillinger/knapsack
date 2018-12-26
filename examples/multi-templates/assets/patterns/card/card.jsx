import React from 'react';

export class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  render() {
    return (
      <aside className={`card card--align-${this.props.align}`}>
        <div className="card__img" style={{ backgroundImage: `url("${this.props.img}")` }} />
        <div className="card__contents">
          <h3 className="card__title">{this.props.title}</h3>
          <p>Count: {this.state.count}</p>
          <button onClick={() => this.setState({ count: this.state.count + 1 })}>Add</button>
          <p className="card__body">{this.props.body}</p>
        </div>
      </aside>
    );
  }
}

Card.defaultProps = {
  align: 'left',
};

export default Card;
