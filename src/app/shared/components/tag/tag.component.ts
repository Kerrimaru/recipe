import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent implements OnInit {
  @Input() tag: string;
  @Input() selected: boolean;
  @Input() disabled = false;

  @Output() toggleTagEmitter = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  toggle() {
    if (this.disabled) {
      return;
    }
    this.selected = !this.selected;
    this.toggleTagEmitter.emit(this.selected);
  }
}
