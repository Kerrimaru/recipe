import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

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
  constructor(private http: HttpClient, private router: Router) {}

  user = new BehaviorSubject<User>(null);
  private tokenExpirationCountdown: any;

  signup(email: string, password: string, name: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
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
          this.handleAuth(resData.email, resData.localId, resData.displayName, resData.idToken, +resData.expiresIn);
          //   const expDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          //   const user = new User(resData.email, resData.localId, resData.idToken, expDate);
          //   this.user.next(user);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.mapError),
        tap((resData) => {
          console.log('login data: ', resData);
          this.handleAuth(resData.email, resData.localId, resData.displayName, resData.idToken, +resData.expiresIn);
          //   const expDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          //   const user = new User(resData.email, resData.localId, resData.idToken, expDate);
          //   this.user.next(user);
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      name: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData.name,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expires = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expires);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationCountdown) {
      clearTimeout(this.tokenExpirationCountdown);
    }
    this.tokenExpirationCountdown = null;
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

  private handleAuth(email: string, id: string, name: string, token: string, expires: number) {
    const expDate = new Date(new Date().getTime() + +expires * 1000);
    const user = new User(email, id, name, token, expDate);
    this.user.next(user);

    this.autoLogout(expires * 1000);

    localStorage.setItem('userData', JSON.stringify(user));
  }

  private mapError(error: HttpErrorResponse) {
    let errorMsg = 'An unkown error occurred';
    if (!error.error || !error.error.error) {
      throwError(errorMsg);
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
}
