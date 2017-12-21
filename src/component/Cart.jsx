import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import '../styles/component/cart.css';
import icon1 from '../assets/img/购物车满@2x.png';

class Title extends PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
    handleClick: PropTypes.func.isRequired,
  }

  render() {
    return(
      <div className="cart" onClick={this.props.handleClick}>
        <img src={icon1} alt="" className="--pos-center"/>
        <div className="cart__count">{this.props.count}</div>
      </div>
    )
  }
}

export default Title;