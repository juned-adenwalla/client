import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router:Router,private auth: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.getUser()) {
      console.log('coming herererererer')
      return true;
    } else {
      // Save the original URL the user was trying to access
      const returnUrl = state.url;
      
      // Redirect to the login page with the returnUrl
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl } });
    }
  }
  
}
