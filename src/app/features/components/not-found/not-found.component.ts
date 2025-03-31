import { Component } from '@angular/core';
import { RouterModule } from "@angular/router"
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  imports: [
    ButtonModule,
    RouterModule  
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
