import React, {Component} from 'react';
import './Modal.css';

class Modal extends Component {
  onClick = e => {
    if(e.target === e.currentTarget) {
      this.props.onClose()
    }
  }
  render() {
    return (
      <div className='Modal' onClick={this.onClick}>
        {this.props.children}
      </div>
    )
  }
}

export default Modal
