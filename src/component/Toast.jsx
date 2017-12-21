import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import '../styles/component/toast.css';


class Toast extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    active: PropTypes.bool.isRequired,
  }

  render() {
    return(
      <div className={`toast__mask${ this.props.active ? ' active' : ''}`}>
        <div className="toast__wrapper">
          <div className="toast__icon"></div>
          <span className="toast__text">{this.props.text}</span>
        </div>
      </div>
    )
  }
}

export default Toast;