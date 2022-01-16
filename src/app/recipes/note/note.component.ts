import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Note } from "../notes/notes.component";

@Component({
  selector: "app-note",
  templateUrl: "./note.component.html",
  styleUrls: ["./note.component.scss"],
})
export class NoteComponent implements OnInit {
  // displayName: string;
  showDetails = false;
  editMode = false;
  noteText: string;

  @ViewChild("noteEdit") textareaRef: ElementRef;

  @Input() note: Note;
  @Input() author: string;
  @Input() readOnly: boolean; // false if note belongs to user

  @Output() deleteNoteEmitter = new EventEmitter<string>();
  @Output() updateNoteEmitter = new EventEmitter<{
    text: string;
    id: string;
  }>();

  constructor() {}

  ngOnInit(): void {
    this.noteText = this.note.note;
  }

  updateNote() {
    this.updateNoteEmitter.emit({ text: this.noteText, id: this.note.id });
    this.editMode = false;
  }

  cancelEdit() {
    this.noteText = this.note.note;
    this.editMode = false;
  }

  selectNote() {
    if (this.editMode) {
      return;
    }
    this.showDetails = !this.showDetails;
  }

  activateEdit() {
    this.editMode = true;
    setTimeout(() => {
      this.textareaRef.nativeElement.focus();
    }, 0o0);
  }
}
