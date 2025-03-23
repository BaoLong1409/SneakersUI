import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  MaybeAsync,
  GuardResult,
  CanActivate,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { CommonService } from '../services/common.service';


@Injectable({
  providedIn: 'root',
})

export class PasswordCanActivateTeam implements CanActivate {
    private sessionToken!: string;
    private token!: string| null;
  constructor(private router: Router, commonService: CommonService) {
    if (typeof sessionStorage) {
      this.sessionToken = this.checkSessionToken();
    }
    this.token = commonService.token;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    if (this.sessionToken || this.token) {
      return true;
    }

    this.router.navigate(['/Login']);
    return false;
  }

  private checkSessionToken() {
    const item = sessionStorage.getItem('sessionToken');
    if (!item) return null;

    const {token, expiresAt} = JSON.parse(item);
    if (Date.now() > expiresAt) {
        sessionStorage.removeItem('sessionToken');
        return null;
    }

    return token;
  }
}
