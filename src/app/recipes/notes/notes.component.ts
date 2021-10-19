import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface Note {
  id: string;
  note: string;
  userId: string;
  user: string;
  date: number;
  show: boolean; // show details
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  constructor() {}

  @Input() notes: any[];
  @Input() currentUserId: number; // if null, user is not logged in and notes are read-only

  @Output() deleteEmitter = new EventEmitter<string>();
  @Output() saveEmitter = new EventEmitter<any>();

  editNoteIndex: number;

  ngOnInit(): void {}

  editNote(index: number, ref?: HTMLElement) {
    this.editNoteIndex = index;
    if (ref) {
      ref.contentEditable = 'true';
      ref.focus();
      document.execCommand('selectAll', false, null);
      document.getSelection().collapseToEnd();
    }
  }

  cancelEdit(el: HTMLElement, previousText: string) {
    el.innerHTML = previousText;
    this.editNoteIndex = null;
  }

  saveNewNote(text: string) {
    // dont save empty note
    if (!text) {
      return;
    }
    this.saveEmitter.emit({ text: text, id: null });
  }

  updateNote(newText: string, noteId: string) {
    this.editNoteIndex = null;
    this.saveEmitter.emit({ text: newText, id: noteId });
  }
}
