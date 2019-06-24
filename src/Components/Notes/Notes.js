import React, { Component } from 'react'
import Card, { CardButton } from '../Card/Card'
import EditNoteModal from '../Modal/EditNoteModal'
import { MdModeEdit } from 'react-icons/md'
import './Notes.css'

import { graphqlOperation, API }  from 'aws-amplify';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import * as subscriptions from '../../graphql/subscriptions';

class Note extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showEditModal: false,
      note: props.note
    }
  }

  showEditModal = () => this.setState({showEditModal: true })
  closeModal = () => this.setState({showEditModal: false})

  updateNote = note => {
    API.graphql(graphqlOperation(mutations.updateNote, {input: note}))
      .then(result => {
        this.setState({
          note: result.data.updateNote
        })
        this.closeModal()
      }).catch(error => console.log(error))
  }

  deleteNote = () => {
    console.log('in deleteNote')
    API.graphql(graphqlOperation(mutations.deleteNote, {input: {id: this.state.note.id}}))
      .then(this.closeModal)
      .catch(error => console.log(error))
  }

  render() {
    return (
      <>
        {this.state.showEditModal &&
          <EditNoteModal note={this.state.note} onClose={this.closeModal}
            updateNote={this.updateNote}
            deleteNote={this.deleteNote}/>}
        <Card title={this.state.note.title} button={
          <CardButton onClick={this.showEditModal}>
            <MdModeEdit size={22} />
          </CardButton>}>
          <p>{this.state.note.content}</p>
        </Card>
      </>
    )
  }
}

class Notes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      notes: []
    }
  }

  componentDidMount() {
    API.graphql(graphqlOperation(queries.listNotes)).then((response) => {
      this.setState({
        notes: response.data.listNotes.items
      })
    }, (error) => {
      console.log(error)
    })
    API.graphql(graphqlOperation(subscriptions.onCreateNote)).subscribe({ next: (noteData) => {
      const note = (({id, title, content}) => ({id, title, content}))(noteData.value.data.onCreateNote)
      this.setState({
        notes: [
          note,
          ...this.state.notes
        ]
      })
    }})
    /*
    API.graphql(graphqlOperation(subscriptions.onUpdateNote)).subscribe({ next: (noteData) => {
      const note = (({id, title, content}) => ({id, title, content}))(noteData.value.data.onUpdateNote)
      let notesCopy = [...this.state.notes]
      let index = this.state.notes.findIndex(n => n.id === note.id)
      notesCopy[index] = note
      this.setState({
        notes: notesCopy
      })
    }})
    */
    API.graphql(graphqlOperation(subscriptions.onDeleteNote)).subscribe({
      next: noteData => {
        const id = noteData.value.data.onDeleteNote.id
        let notesCopy = [...this.state.notes]
        let index = notesCopy.findIndex(note => note.id === id)
        notesCopy.splice(index, 1)
        this.setState({
          notes: notesCopy
        })
      }
    })
  }

  render() {
    return (
      <div className='Notes flexRow'>
      {
        this.state.notes &&
        this.state.notes.map(note => <Note key={note.id} note={note} editNote={this.props.editNote}/>)
      }
      </div>
    );
  }

}

export default Notes;
