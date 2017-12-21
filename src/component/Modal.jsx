import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import '../styles/component/modal.css';


class Modal extends PureComponent {
  static propTypes = {
    cancelClick: PropTypes.func,
    confirmClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    button: PropTypes.string
  }

  render() {
    return (
      <div className="modal__wrapper">
        <div className="modal__body">{this.props.text}</div>
        {
          this.props.button ? (
            <div className="modal__btn">
              <button className="modal__btn--one" onClick={this.props.confirmClick}>{this.props.button}</button>
            </div>
          ) : (
              <div className="modal__btn">
                <button onClick={this.props.cancelClick}>取消</button><button onClick={this.props.confirmClick}>确认</button>
              </div>
            )
        }
      </div>
    )
  }
}

export default Modal;