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
import { UserDto } from '../dtos/user.dto';


@Injectable({
  providedIn: 'root',
})

export class AdminCanActiveTeam implements CanActivate {
   private userInfo!: UserDto;
  constructor(private router: Router, commonService: CommonService) {
    this.userInfo = commonService.userInfor;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {

    if (Object.keys(this.userInfo).length > 0) {
        if (this.userInfo?.rolesName.includes("Admin")) {
            return true;
        }
        this.router.navigate(['/404']);
        return false;
    }
    this.router.navigate(['/404']);
    return false;
  }

}
