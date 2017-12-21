import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import '../styles/component/message.css';


class Message extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    active: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
  }

  render() {
    return(
      <div className={`message__wrapper${ this.props.active ? ' active' : ''}`} onAnimationEnd={this.props.close}>
        {this.props.children}
      </div>
    )
  }
}

export default Message;