import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
// import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { DialogService } from '../shared/dialog/dialog.service';
import { GoogleAuthProvider } from 'firebase/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [],
})
export class AuthComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: DialogService
  ) {}

  isLogin = true;
  loading = false;
  isSignup: boolean; // if only signup, no login offered
  isDialog: boolean;

  ngOnInit() {
    this.isDialog = !!this.dialog.dialogData;
    if (this.dialog.dialogData) {
      this.isSignup = this.dialog.dialogData.signup;
      this.isLogin = false;
    }
  }

  toggleLogin() {
    this.isLogin = !this.isLogin;
  }

  googleAuth() {
    return this.authService
      .googleLogin(new GoogleAuthProvider())
      .then((res) => this.router.navigate(['/recipes']))
      .catch((err) => console.error(err));
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return this.openSnackBar('Check your details');
    }

    this.loading = true;
    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
    const params = this.isLogin ? null : { notify: 'welcome' };
    const data = this.isLogin ? null : { name: name };

    const authPromise: Promise<any> = this.isLogin
      ? this.authService.firebaseLogin(email, password)
      : this.authService.firebaseSignup(email, password, name);

    authPromise.then((res) => {
      if (typeof res === 'string') {
        this.loading = false;
        let msg = res;
        if (res === 'goSignup') {
          this.isLogin = false;
          msg = 'Email not found! Please add your name to create an account.';
        }
        return this.openSnackBar(msg);
      }

      if (this.dialog.dialogData) {
        this.dialog.close(name);
      } else {
        this.router.navigate(['/recipes'], {
          queryParams: params,
          state: { data: data },
        });
      }
    });
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  signInGuest() {
    this.loading = true;
    this.authService.guestLogin().then((res) => {
      if (res === 'success') {
        this.router.navigate(['/recipes'], {
          queryParams: { notify: 'guest' },
        });
      } else {
        this.loading = false;
        this.openSnackBar(res);
      }
    });
  }
}
