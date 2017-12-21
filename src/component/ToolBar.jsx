import React, { PureComponent } from 'react';
import '../styles/component/tool-bar.css';


class ToolBar extends PureComponent {

  render() {
    return(
      <footer className="toolbar__wrapper">
        {this.props.children}
      </footer>
    )
  }
}

export default ToolBar;