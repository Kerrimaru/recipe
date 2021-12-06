import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-date",
  templateUrl: "./date.component.html",
  styleUrls: ["./date.component.scss"],
})
export class DateComponent implements OnInit {
  constructor() {}

  @Input() dates;
  @Input() disabled = false;

  @Output() actionEmitter = new EventEmitter<string | Date>();

  dateInput: any;

  ngOnInit(): void {}
}
