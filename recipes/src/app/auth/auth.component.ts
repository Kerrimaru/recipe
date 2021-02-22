import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  isLogin = true;
  loading = false;

  ngOnInit() {}

  toggleLogin() {
    this.isLogin = !this.isLogin;
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
      this.loading = false;
      if (typeof res === 'string') {
        return this.openSnackBar(res);
      }
      this.router.navigate(['/recipes'], { queryParams: params, state: { data: data } });
    });
    // form.reset();
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  signInGuest() {
    this.loading = true;
    this.authService.guestLogin().then((res) => {
      this.loading = false;
      if (res === 'success') {
        this.router.navigate(['/recipes'], { queryParams: { notify: 'guest' } });
      } else {
        this.snackBar.open(res);
      }
    });
  }
}
