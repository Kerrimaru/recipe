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

  login(email: string, password: string) {
    return this.fbAuth.signInWithEmailAndPassword(email, password).catch((error) => this.mapError(error));
  }

  fbSignup(email: string, password: string, name: string) {
    return this.fbAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        const user = res.user;
        user.updateProfile({ displayName: name });
        return user;
      })
      .catch((error) => this.mapError(error));
  }

  autoLogin(user) {
    this.handleAuth(user.email, user.uid, user.displayName, user.refreshToken)
      .pipe(
        map((res) => {
          // console.log('login res: ', res);
          this.settingsService.fetchUserSettings(res.id);
        }),
        map(() => this.recipeService.fetchRecipes())
      )
      .subscribe();
  }

  logout() {
    this.settingsService.favs$.next(null);

    this.user.next(null);
    this.fbAuth.signOut().then((res) => {
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

  handleAuth(email: string, id: string, name: string, token: string): Observable<any> {
    const user = new User(email, id, name, token);
    this.user.next(user);
    return of(user);
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
        errorMsg = 'Email not found! Please go to sign up';
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
