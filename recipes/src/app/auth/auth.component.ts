import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  isLogin = true;
  loading = false;
  error: string = null;

  ngOnInit() {}

  toggleLogin() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    console.log('form: ', !form.valid, form.value);
    if (!form.valid) {
      return;
    }

    let authObs: Observable<AuthResponseData>;

    this.loading = true;
    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
    console.log(email, password);
    // kerr test no good :(
    //   const action = this.isLogin ? 'login' : 'signup';
    // this.authService.signUpIn(email, password, action).subscribe(
    //   (res) => {
    //     console.log('res: ', res);
    //     this.loading = false;
    //   },
    //   (errorMsg) => {
    //     console.log('error: ', errorMsg);
    //     this.error = errorMsg;
    //     this.loading = false;
    //   }
    // );
    //////
    if (this.isLogin) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password, name);
    }

    authObs.subscribe(
      (res) => {
        console.log('res: ', res);
        this.loading = false;
        this.router.navigate(['/recipes']);
      },
      (errorMsg) => {
        console.log('error: ', errorMsg);
        this.error = errorMsg;
        this.loading = false;
      }
    );

    form.reset();
  }
}
