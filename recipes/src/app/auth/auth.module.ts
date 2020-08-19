import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AuthComponent],
  //   imports: [SharedModule, RouterModule.forChild([{ path: 'login', component: AuthComponent }])],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: AuthComponent }])],
})
export class AuthModule {}
