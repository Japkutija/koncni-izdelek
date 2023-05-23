import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationExtras, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let isAuth: boolean;
    isAuth = !!localStorage.getItem('token'); //Če token v cookie -u obstaja (user prijavljen), je isAuth true, drugače pa je false.
    if (isAuth) { 
      return true; //Če token v cookiju obstaja, nadaljuj.
    } else {
      // return false; //Če ne obstaja v cookie-ju, returnaj false. Preusmerlo bo v headercomponentu.
      return this.router.createUrlTree(['/welcome-page']);
    }
  }
}
