import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { canActivate } from "@angular/fire/compat/auth-guard";
import { map } from "rxjs/operators";
import { IntroComponent } from "./intro.component";
import { AuthModule } from "../auth/auth.module";
import { AuthComponent } from "../auth/auth.component";

const redirectUnauthToLogin = () =>
  map((user) => {
    // console.log('user in routing: ', user);
    if (user) {
      return [""];
    } else {
      return true;
    }
    // return !user ? ['login'] : [''];
  });

@NgModule({
  declarations: [IntroComponent, AuthComponent],
  // imports: [SharedModule, RouterModule.forChild([{ path: 'login', component: AuthComponent }])],
  imports: [
    SharedModule,
    AuthModule,
    RouterModule.forChild([
      {
        path: "",
        component: IntroComponent,
        ...canActivate(redirectUnauthToLogin),
      },
    ]),
  ],
})
export class IntroModule {}
