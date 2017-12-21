import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import '../styles/component/title.css';


class Title extends PureComponent {
  static propTypes = {
    content: PropTypes.element,
    text: PropTypes.string.isRequired
  }

  render() {
    return(
      <header className="title__wrapper">
        {this.props.content}
        <div className="title__text">{this.props.text}</div>
      </header>
    )
  }
}

export default Title;