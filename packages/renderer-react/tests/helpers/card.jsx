import React from 'react';
import PropTypes from 'prop-types';

// export const CardButton = ({ disabled = false, text }) => (
//   <button>{text}</button>
// );

export class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick() {
    this.setState(prevState => {
      const newCount = prevState.count + 1;
      this.props.handleClick(newCount);
      return { count: newCount };
    });
  }

  render() {
    return (
      <aside
        className={`card card--align-${this.props.align}${
          this.props.isDark ? ' card--dark' : ''
        }`}
      >
        {this.props.headerSlot}
        <div
          className="card__img"
          style={{ backgroundImage: `url("${this.props.img}")` }}
        />
        <div className="card__contents">
          <h3 className="card__title">{this.props.title}</h3>
          <p>Count: {this.state.count}</p>
          <button onClick={this.handleButtonClick} type="button">
            Add
          </button>
          <p className="card__body">{this.props.body}</p>
        </div>
        <footer className="card__footer">{this.props.children}</footer>
      </aside>
    );
  }
}

Card.defaultProps = {
  align: 'left',
  children: null,
  handleClick: () => {},
  isDark: false,
};

Card.propTypes = {
  /**
   * The card title
   */
  title: PropTypes.string.isRequired,
  align: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node,
  headerSlot: PropTypes.node.isRequired,
  handleClick: PropTypes.func,
  isDark: PropTypes.bool,
};

// export default Card;
