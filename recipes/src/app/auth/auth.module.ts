import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';
import { canActivate } from '@angular/fire/auth-guard';
import { map } from 'rxjs/operators';

const redirectUnauthToLogin = () =>
  map((user) => {
    // console.log('user in routing: ', user);
    if (user) {
      console.log('login');
      return [''];
    } else {
      console.log('empty');
      return true;
    }
    // return !user ? ['login'] : [''];
  });

@NgModule({
  declarations: [AuthComponent],
  // imports: [SharedModule, RouterModule.forChild([{ path: 'login', component: AuthComponent }])],
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: AuthComponent, ...canActivate(redirectUnauthToLogin) }]),
  ],
})
export class AuthModule {}
