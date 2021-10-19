import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, public fbAuth: AngularFireAuth) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    // return this.authService.user.pipe(
    //   take(1),
    //   map((user) => {
    //     const isAuth = !!user;
    //     if (isAuth) {
    //       return true;
    //     }
    //     return this.router.createUrlTree(['/login']);
    //   })
    // );

    return this.fbAuth.authState.pipe(
      take(1),
      map((user) => {
        if (user) {
          return true;
        } else {
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}
