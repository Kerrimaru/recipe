import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
// import { AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireDatabase } from '@angular/fire/database';
// import firebase

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, public fbAuth: AngularFireAuth) {}

  ngOnInit() {
    document.documentElement.className = 'theme-vanilla';
    // if (this.authService.user) {
    //   console.log('there is a user in app component: ', this.authService.user);
    //   this.authService.autoLogin();
    // }

    this.fbAuth.authState.subscribe((user) => {
      console.log('autologin user: ', user);
      // user ? this.handleAuth(user.email, user.uid, user.displayName, user.refuserhToken) : this.user.next(null);
      if (user) {
        // const user = {user.email, user.uid, user.displayName, user.refreshToken}
        // this.authService.user.next(user)
        this.authService.autoLogin(user);
        // this.authService.handleAuth(user.email, user.uid, user.displayName, user.refreshToken).pipe(
        //   map(res => {

        //   })
        // );
      }

      // this.initializer.init().subscribe(
      //   () => {
      //
      //     this.status = 'loaded';
      //     this.handleQueryParamFlags();
      //     this.otherStuffAfterLoadSuccess();
      //   },
      //   (err) => {
      //     this.status = 'error';
      //   }
      // );
    });
  }
}
