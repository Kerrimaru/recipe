import { Component, EventEmitter, Input, Output } from "@angular/core";

export interface Note {
  id: string;
  note: string;
  userId: string;
  user: string;
  date: number;
}

@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.scss"],
})
export class NotesComponent {
  constructor() {}

  @Input() notes: Note[];
  @Input() currentUserId: number; // if null, user is not logged in and notes are read-only

  @Output() deleteEmitter = new EventEmitter<string>();
  @Output() saveEmitter = new EventEmitter<any>();
  @Output() signupEmitter = new EventEmitter<any>();

  saveNewNote(text: string) {
    // dont save empty note
    if (!text) {
      return;
    }
    this.saveEmitter.emit({ text: text, id: null });
  }

  updateNote(ev) {
    this.saveEmitter.emit({ text: ev.text, id: ev.id });
  }
}
