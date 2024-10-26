import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { canActivate } from '@angular/fire/compat/auth-guard';
import { map } from 'rxjs/operators';
import { LoginLandingComponent } from './login-landing.component';
import { GoogleAuthComponent } from '../auth/google-auth/google-auth.component';
import { AuthComponent } from '../auth/auth.component';

const redirectUnauthToLogin = () =>
  map((user) => {
    if (user) {
      return [''];
    } else {
      return true;
    }
  });

@NgModule({
  declarations: [AuthComponent, LoginLandingComponent, GoogleAuthComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        // component: AuthComponent,
        component: LoginLandingComponent,
        ...canActivate(redirectUnauthToLogin),
      },
    ]),
  ],
})
export class LoginLandingModule {}
