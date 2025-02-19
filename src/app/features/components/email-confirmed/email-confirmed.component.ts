import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/commonComponent/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHeaderComponent } from '../../../core/components/app-header/app-header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-email-confirmed',
  imports: [
    AppHeaderComponent,
    TranslateModule
  ],
  templateUrl: './email-confirmed.component.html',
  styleUrl: './email-confirmed.component.scss'
})
export class EmailConfirmedComponent extends BaseComponent implements OnInit {
  public status!: string;
  constructor(
    private readonly router : Router,
    private readonly route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.status = this.route.snapshot.paramMap.get('status') ?? '';
  }

  public backToLogin(){
    this.router.navigateByUrl("/Login");
  }
}
