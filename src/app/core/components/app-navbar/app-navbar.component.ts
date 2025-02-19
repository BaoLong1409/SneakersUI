import { Component } from '@angular/core';
import { BaseComponent } from 'primeng/basecomponent';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-app-navbar',
  imports: [
  ],
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.scss'
})
export class AppNavbarComponent extends BaseComponent{
  constructor() {
    super();
  }
}
