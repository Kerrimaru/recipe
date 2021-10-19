import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent implements OnInit {
  constructor() {}

  @Input() dates;

  @Output() deleteDateEmitter = new EventEmitter<any>();
  @Output() addDateEmitter = new EventEmitter<any>();

  dateInput: any;

  ngOnInit(): void {}
}
