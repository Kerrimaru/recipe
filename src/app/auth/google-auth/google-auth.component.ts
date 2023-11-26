import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-google-auth",
  templateUrl: "./google-auth.component.html",
  styleUrls: ["./google-auth.component.scss"],
})
export class GoogleAuthComponent implements OnInit {
  constructor() {}

  @Output() googleSigninEmitter = new EventEmitter<any>();

  ngOnInit(): void {}
}
