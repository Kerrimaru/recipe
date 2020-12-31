import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class FirebaseAuthService {
  private authState: Observable<firebase.User>;
  private currentUser: firebase.User = null;

  constructor(
    public afAuth: AngularFireAuth,
    private http: HttpClient,
    //   private localStorage: LocalStorageService,
    private router: Router //   private snackBar: MatSnackBar
  ) {
    this.authState = this.afAuth.authState;

    this.authState.subscribe(
      (user) => {
        console.log('user :', user);
        if (user) {
          this.currentUser = user;
          localStorage.setItem('userData', JSON.stringify(user));
          // this.localStorage.storeSimple('userData', user)
          // this.openSnackBar('Successfully authenticated');
          console.log('AUTHSTATE USER', user);
          this.router.navigate(['home']);
        } else {
          console.log('AUTHSTATE USER EMPTY', user);
          this.currentUser = null;
        }
      },
      (err) => {
        // this.openSnackBar(`${err.status} ${err.statusText} (${err.error.message})`, 'Please try again')
      }
    );
  }

  isAuthenticated(): boolean {
    return this.authState !== null;
  }

  loginEmail(email, password, route) {
    this.afAuth.signInWithEmailAndPassword(email, password).catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      //    this.openSnackBar(error, 'OK')
    });
  }

  logout() {
    this.afAuth.signOut();
    //   .then(response => this.openSnackBar('Signed out'))
    //   .catch(error => this.openSnackBar('Error signing out: ' + error));
  }
}
