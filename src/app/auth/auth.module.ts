// import { NgModule } from "@angular/core";
// import { SharedModule } from "../shared/shared.module";
// import { AuthComponent } from "./auth.component";
// import { RouterModule } from "@angular/router";
// import { canActivate } from "@angular/fire/compat/auth-guard";
// import { map } from "rxjs/operators";
// import { GoogleAuthComponent } from "./google-auth/google-auth.component";

// const redirectUnauthToLogin = () =>
//   map((user) => {
//     if (user) {
//       return [""];
//     } else {
//       return true;
//     }
//   });

// @NgModule({
//   declarations: [AuthComponent, GoogleAuthComponent],
//   imports: [
//     SharedModule,
//     RouterModule.forChild([
//       {
//         path: "",
//         component: AuthComponent,
//         ...canActivate(redirectUnauthToLogin),
//       },
//     ]),
//   ],
// })
// export class AuthModule {}
