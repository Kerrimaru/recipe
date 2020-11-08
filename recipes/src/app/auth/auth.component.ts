import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { RecipeService } from '../recipes/recipe.service';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private recipeService: RecipeService) {}

  isLogin = true;
  loading = false;
  error: string = null;

  ngOnInit() {}

  toggleLogin() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    console.log('form: ', form.valid, form.value);
    if (!form.valid) {
      return;
    }

    // let authObs: Observable<AuthResponseData>;
    let authPromise: Promise<any>;

    this.loading = true;
    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
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
      authPromise = this.authService.login(email, password);
      // this.authService.login(email, password).then((res) => {
      //   console.log('res? ', res);
      //   this.loading = false;
      //   this.router.navigate(['/recipes']);
      // });
    } else {
      // authPromise = this.authService.signup(email, password, name);
      authPromise = this.authService.fbSignup(email, password, name);
    }

    authPromise.then(
      (res) => {
        const user = res.user;
        console.log('Res: ', res);
        // return of(0);
        // this.handleAuth(user.email, user.uid, user.displayName, user.refreshToken, +user.expiresIn);
        this.authService
          .handleAuth(user.email, user.uid, user.displayName, user.refreshToken)
          .pipe(
            map((userRes) => {
              console.log('userRes: ', userRes);
              return this.recipeService.fetchRecipes();
            })
          )
          .subscribe((r) => {
            console.log('R: ', r);
            this.loading = false;
            this.router.navigate(['/recipes']);
          });
        // this.router.navigate(['/recipes']);
      },
      (errorMsg) => {
        console.log('error: ', errorMsg);
        this.error = errorMsg;
        this.loading = false;
      }
    );

    form.reset();
  }

  // onSubmit(form: NgForm) {
  //   if (!form.valid) {
  //         return;
  //       }
  //   this.authService.doRegister(form.value)
  // .then(res => {
  //   console.log(res);
  //   // this.errorMessage = "";
  //   // this.successMessage = "Your account has been created";
  // }, err => {
  //   console.log(err);
  //   // this.errorMessage = err.message;
  //   // this.successMessage = "";
  // });
  // }
}
