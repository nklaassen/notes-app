import React, { Component } from 'react';
import './Card.css';

export class CardButton extends Component {
  render() {
    return (
      <button className='CardButton shadow primary' onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

class Card extends Component {
  render() {
    return (
      <div className='Card shadow'>
        <header className='CardHeader Container secondary'>
          <h1 className='Card-title'>
            {this.props.title}
          </h1>
        </header>
        {this.props.button}
        <div className='CardContent Container'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Card;
