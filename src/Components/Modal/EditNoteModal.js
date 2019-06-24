import React, {Component} from 'react';
import Card, {CardButton} from '../Card/Card';
import Modal from './Modal.js';
import {MdDeleteForever} from 'react-icons/md'

class EditNoteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: this.props.note || {
        title: '',
        content: '',
      }
    }
  }

  onChange = e => {
    this.setState({
      note: {
        ...this.state.note,
        [e.target.name]: e.target.value
      }
    })
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.updateNote(this.state.note)
  }

  render() {
    return (
      <Modal onClose={this.props.onClose}>
        <Card title={this.state.note.title || "New Note"} button={
          <CardButton onClick={this.props.deleteNote}>
            <MdDeleteForever size={24} />
          </CardButton>}>
          <form className="flexCol" onSubmit={this.onSubmit}>
            <input type="text" name="title" value={this.state.note.title} placeholder="Title" onChange={this.onChange} />
            <textarea name="content" value={this.state.note.content} placeholder="Enter your note here" onChange={this.onChange} />
            <button type="submit" disabled={!this.state.note.title || !this.state.note.content}>
              <h2>Submit</h2>
            </button>
          </form>
        </Card>
      </Modal>
    )
  }
}

export default EditNoteModal;
