import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
// import firebase

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoLogin();

    // const config = {
    //   apiKey: 'AIzaSyBaSbh-bfBWCkpkU8X1V_f9VcK3OsJ4mww',
    //   authDomain: 'kerr-recipe.firebaseapp.com',
    //   databaseURL: 'https://kerr-recipe.firebaseio.com/',
    //   storageBucket: 'bucket.appspot.com',
    // };
    // firebase.initializeApp(config);
    // // Get a reference to the database service
    // var database = firebase.database();
  }
}
