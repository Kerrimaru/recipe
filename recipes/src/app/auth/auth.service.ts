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

  // signup(email: string, password: string, name: string) {
  //   return this.http
  //     .post<AuthResponseData>(
  //       `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
  //       {
  //         email: email,
  //         password: password,
  //         displayName: name,
  //         returnSecureToken: true,
  //       }
  //     )
  //     .pipe(
  //       catchError(this.mapError),
  //       tap((resData) => {
  //         this.handleAuth(resData.email, resData.localId, resData.displayName, resData.idToken);
  //       })
  //     );
  // }

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
      // console.log('logout res: ', res);
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
    console.log('error: ', errorMsg);
    return throwError(errorMsg);
  }
}
