import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { RecipeService } from '../recipes/recipe.service';
import { switchMap, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private recipeService: RecipeService,
    private _snackBar: MatSnackBar
  ) {}

  isLogin = true;
  loading = false;
  // error: string = null;

  ngOnInit() {}

  toggleLogin() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      console.log('form not valid');
      this.openSnackBar('Check your details');
      return;
    }
    let authPromise: Promise<any>;

    this.loading = true;
    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
    if (this.isLogin) {
      authPromise = this.authService.login(email, password);
    } else {
      authPromise = this.authService.fbSignup(email, password, name);
    }

    authPromise.then((res) => {
      if (typeof res === 'string') {
        this.openSnackBar(res);
        // this.error = res;
        this.loading = false;
        return;
      }

      const user = res;
      this.authService
        .handleAuth(user.email, user.uid, user.displayName, user.refreshToken)
        .pipe(map((userRes) => this.recipeService.fetchRecipes()))
        .subscribe((r) => {
          this.router.navigate(['/recipes']);
        });
    });
    form.reset();
  }

  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
