import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, of, Observable, forkJoin } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
// import * as firebase from 'firebase/app';
// import { AngularFireDatabase } from '@angular/fire/database';
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
    public firebaseAuth: AngularFireAuth,
    // private firebase: AngularFireDatabase,
    // private initializer: InitializerService
    private recipeService: RecipeService,
    private settingsService: UserSettingsService
  ) {}

  user = new BehaviorSubject<User>(null);
  readOnly = new BehaviorSubject<boolean>(null);
  settingsRef: any;

  private tokenExpirationCountdown: any;

  firebaseLogin(email: string, password: string) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password).catch((error) => {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        return 'goSignup';
      } else {
        return this.mapError(error);
      }
    });
    // this.mapError(error));
  }

  firebaseSignup(email: string, password: string, name: string) {
    return this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        // localStorage.setItem('userName', JSON.stringify(name));
        const user = res.user;
        user.updateProfile({ displayName: name }).then((res) => {
          this.handleAuth(email, user.uid, name, user.refreshToken);

          // this.user.getValue().name = 'kerri';
          return user;
          //
        });
      })
      .catch((error) => this.mapError(error));
  }

  autoLogin(user) {
    this.handleAuth(user.email, user.uid, user.displayName, user.refreshToken)
      .pipe(
        tap((res) => (this.settingsRef = this.settingsService.fetchUserSettings(res.id))),
        tap((res) => (this.settingsRef = this.settingsService.fetchFavsList(res.id))),
        tap((res) => (this.settingsRef = this.settingsService.fetchToDoList(res.id))),
        tap(() => {
          const readOnly = this.readOnly.getValue();
          return this.recipeService.fetchRecipes(readOnly ? 30 : null);
        })
      )
      .subscribe();
  }

  updateUserName(user, name) {
    return user.updateProfile({ displayName: name });
  }

  handleAuth(email: string, id: string, name: string, token: string): Observable<any> {
    const user = new User(email, id, name, token);
    this.readOnly.next(!email);
    this.user.next(user);
    return of(user);
  }

  guestLogin(): Promise<any> {
    return this.firebaseAuth
      .signInAnonymously()
      .then((res) => {
        this.readOnly.next(true);
        return 'success';
      })
      .catch((error) => {
        // var errorCode = error.code;
        var errorMessage = error.message;
        return errorMessage;
      });
  }

  logout() {
    this.readOnly.next(null);
    this.user.next(null);
    this.firebaseAuth.signOut().then((res) => {
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

  private mapError(error): string {
    let errorMsg = 'An unkown error occurred';
    if (!error.code) {
      // (!error.error || !error.error.error) {
      return errorMsg;
      // return error.message ? throwError(error.message) : throwError(errorMsg);
    }

    switch (
      error.code // (error.error.error.message) {
    ) {
      case 'auth/email-already-in-use': // 'EMAIL_EXISTS':
        errorMsg = 'Account already exists! Please sign in';
        break;
      case 'auth/user-not-found': // 'EMAIL_NOT_FOUND':
        errorMsg = 'Account does not exist! Please add your name to create an account';
        break;
      case 'auth/wrong-password': // 'INVALID_PASSWORD':
        errorMsg = 'Wrong password';
        break;
      case 'auth/too-many-requests': // 'USER_DISABLED':
        errorMsg = 'Too many login attempts! This account has been temporarily disabled';
        break;
    }
    return errorMsg;
    // return throwError(errorMsg);
  }
}
