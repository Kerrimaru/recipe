import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-login-landing",
  templateUrl: "./login-landing.component.html",
  styleUrls: ["./login-landing.component.scss"],
})
export class LoginLandingComponent implements OnInit {
  bgImage = "";
  constructor() {}

  ngOnInit(): void {
    this.bgImage =
      Math.random() < 0.5 ? "bruna-branco.jpg" : "nadine-primeau.jpg";
  }
}
