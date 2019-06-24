import React, { Component } from 'react';
import { MdNoteAdd } from 'react-icons/md'
import logo from './logo.svg';
import Notes from './Components/Notes/Notes';
import EditNoteModal from './Components/Modal/EditNoteModal';
import './App.css';

import awsconfig from './aws-exports.js'
import Amplify, { API, graphqlOperation }  from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import * as mutations from './graphql/mutations';

Amplify.configure(awsconfig)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: null
    }
  }

  closeModal = () => {
    this.setState({
      modal: null
    })
  }

  showAddNoteModal = () => {
    this.setState({
      modal:
        <EditNoteModal onClose={this.closeModal}
          updateNote={(note) => {
            API.graphql(graphqlOperation(mutations.createNote, {input: note}))
              .then(this.closeModal)
              .catch(error => console.log(error))
          }}
          deleteNote={this.closeModal}/>
    })
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <Notes className='flexRow' editNote={this.showEditNoteModal} />
        <button className='App-button primary shadow' onClick={this.showAddNoteModal}>
          <MdNoteAdd size={22} />
        </button>
        {this.state.modal}
      </div>
    );
  }
}

export default withAuthenticator(App, {
  usernameAttributes: 'email',
  signUpConfig: {
    signUpFields: [
      {
        label: 'Name',
        key: 'name',
        required: 'true',
        displayOrder: 1,
        type: 'string'
      },
    ],
    hiddenDefaults: [ 'phone_number' ]
  }
})
