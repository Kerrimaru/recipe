import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject, of, Observable } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import { RecipeService } from '../recipes/recipe.service';
import { UserSettingsService } from '../settings/user-settings.service';
// import { auth } from 'firebase/app';

export interface AuthResponseData {
  idToken: string;
  email: string;
  displayName: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    public fbAuth: AngularFireAuth,
    private fb: AngularFireDatabase, // private initializer: InitializerService
    private recipeService: RecipeService,
    private settingsService: UserSettingsService
  ) {}

  user = new BehaviorSubject<User>(null);
  private tokenExpirationCountdown: any;

  signup(email: string, password: string, name: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
        {
          email: email,
          password: password,
          displayName: name,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.mapError),
        tap((resData) => {
          this.handleAuth(resData.email, resData.localId, resData.displayName, resData.idToken);
          //   const expDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          //   const user = new User(resData.email, resData.localId, resData.idToken, expDate);
          //   this.user.next(user);
        })
      );
  }

  login(email: string, password: string) {
    return (
      this.fbAuth
        .signInWithEmailAndPassword(email, password)
        // .then((res) => {
        //   const user = res.user;
        //   // return of(0);
        //   // this.handleAuth(user.email, user.uid, user.displayName, user.refreshToken, +user.expiresIn);
        //   this.handleAuth(user.email, user.uid, user.displayName, user.refreshToken);
        // })
        .catch((error) => this.mapError(error))
    );

    // return this.http
    //   .post<AuthResponseData>(
    //     `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`,
    //     {
    //       email: email,
    //       password: password,
    //       returnSecureToken: true,
    //     }
    //   )
    //   .pipe(
    //     catchError(this.mapError),
    //     tap((resData) => {

    //       this.handleAuth(resData.email, resData.localId, resData.displayName, resData.idToken, +resData.expiresIn);
    //       //   const expDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    //       //   const user = new User(resData.email, resData.localId, resData.idToken, expDate);
    //       //   this.user.next(user);
    //     })
    //   );
  }

  fbSignup(email: string, password: string, name: string) {
    return (
      this.fbAuth
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          const user = res.user;
          user.updateProfile({ displayName: name });
          this.handleAuth(user.email, user.uid, name, user.refreshToken);
        })

        // this.fbAuth.updateCurrentUser(user).then(user => {
        //   user.displayName = name;
        // }
        // return of(0);
        // this.handleAuth(user.email, user.uid, user.displayName, user.refreshToken, +user.expiresIn);

        // .then((user) => {
        //   console.log('user? : ', user);
        //   // this.handleAuth(user.email, user.uid, user.displayName, user.refreshToken, 3600)
        // })
        .catch((error) => this.mapError(error))
    );
  }

  autoLogin(user?) {
    // if (this.fbAuth.user) {
    //   console.log('there is a user: ', this.fbAuth.user);

    //   this.fbAuth.authState.subscribe((user) => {
    //     console.log('autologin user: ', user);
    //     // user ? this.handleAuth(user.email, user.uid, user.displayName, user.refuserhToken) : this.user.next(null);
    //     if (user) {
    // const user = new User(
    //   user.email,
    //   user.uid,
    //   user.displayName,
    //   user.refreshToken
    //   // new Date(userData._tokenExpirationDate)
    // );
    console.log('auth state user: ', user);

    this.handleAuth(user.email, user.uid, user.displayName, user.refreshToken)
      .pipe(
        map((res) => {
          console.log('login res: ', res);
          this.settingsService.fetchUserSettings(res.id);
        }),
        map((res) => {
          console.log('Res: ', res);
          return this.recipeService.fetchRecipes();
        })
      )
      .subscribe((res) => {
        console.log('Res: ', res);
        // this.loading = false;
        // this.router.navigate(['/recipes']);
      });
    // this.user.next(user);
    //     } else {
    //       this.user.next(null);
    //     }
    //   });
    // } else {
    //   this.user.next(null);
    // }
    // console.log('this.fbAuth.currentUser ', this.fbAuth.currentUser);
    // const testy = JSON.parse(localStorage.getItem('userData'));
    // console.log('testy: ', testy);
    // // this.logout();
    // const userData: {
    //   email: string;
    //   id: string;
    //   name: string;
    //   _token: string;
    //   _tokenExpirationDate: string;
    // } = JSON.parse(localStorage.getItem('userData'));
    // console.log('autologin user data: ', userData);
    // if (!userData) {
    //   console.log('no data!!! ');
    //   return;
    // }
    // // const curr = firebase.auth();
    // // console.log('curr: ', curr);
    // // const test = JSON.parse(JSON.stringify(this.fbAuth.currentUser)).stsTokenManager.accessToken;
    // // console.log('test: ', test);
    // const loadedUser = new User(
    //   userData.email,
    //   userData.id,
    //   userData.name,
    //   userData._token,
    //   new Date(userData._tokenExpirationDate)
    // );
    // console.log('loadedUser!!! ', loadedUser);
    // if (loadedUser.token) {
    //   console.log('has token!!! ');
    //   this.user.next(loadedUser);
    //   const expires = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
    //   this.autoLogout(expires);
    // }
  }

  logout() {
    this.user.next(null);
    this.fbAuth.signOut().then((res) => {
      console.log('logout res: ', res);
      this.router.navigate(['/login']);
      localStorage.removeItem('userData');
      if (this.tokenExpirationCountdown) {
        clearTimeout(this.tokenExpirationCountdown);
      }
      this.tokenExpirationCountdown = null;
    });
  }

  autoLogout(expDuration: number) {
    this.tokenExpirationCountdown = setTimeout(() => {
      this.logout();
    }, expDuration);
  }

  //   signUpIn(email: string, password: string, action: string) {
  //     const urlSegment = action === 'login' ? 'signInWithPassword' : 'signUp';
  //     return this.http
  //       .post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:${urlSegment}?key=${this.key}`, {
  //         email: email,
  //         password: password,
  //         returnSecureToken: true,
  //       })
  //       .pipe(
  //         catchError(this.mapError),
  //         tap((resData) => {
  //           this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
  //         })
  //       );
  //   }

  handleAuth(email: string, id: string, name: string, token: string): Observable<any> {
    const user = new User(email, id, name, token);
    this.user.next(user);
    return of(user);
    // this.recipeService
    //   .fetchRecipes()
    //   .pipe(
    //     switchMap((res) => {
    //       console.log('switch res: ', res);
    //       return res;
    //     })
    //   )
    //   .subscribe((res) => {
    //     console.log('res: ', res);
    //     this.user.next(user);
    //   });
    // this.initializer.init();
    // this.user.next(user);
    // this.fbAuth.authState.subscribe((res) => {
    //   console.log('auth state res: ', res);
    //   this.user.next(user);
    // });
    // this.user.next(this.fbAuth.authState.value);
    // this.autoLogout(expires * 1000);
    // localStorage.setItem('userData', JSON.stringify(user));
  }

  private mapError(error: HttpErrorResponse) {
    let errorMsg = 'An unkown error occurred';
    if (!error.error || !error.error.error) {
      return error.message ? throwError(error.message) : throwError(errorMsg);
    }

    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMsg = 'There is already an account associated with this email';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'There no account associated with this email';
        break;
      case 'INVALID_PASSWORD':
        errorMsg = 'Wrong password';
        break;
      case 'USER_DISABLED':
        errorMsg = 'THis account has been disabled';
        break;
    }
    return throwError(errorMsg);
  }

  // doRegister(value) {
  //   return new Promise<any>((resolve, reject) => {
  //     // firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
  //     firebase
  //       .auth()
  //       .createUserWithEmailAndPassword(value.email, value.password)
  //       .then(
  //         (res) => {
  //           resolve(res);
  //         },
  //         (err) => reject(err)
  //       );
  //   });
  // }
}
