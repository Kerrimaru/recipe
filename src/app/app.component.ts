import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public fbAuth: AngularFireAuth
  ) {}

  navExpanded = false;

  ngOnInit() {
    // to do: themes
    // document.documentElement.className = 'theme-vanilla';

    this.fbAuth.authState.subscribe((user) => {
      if (user) {
        this.authService.autoLogin(user);
      }
    });
  }
}
