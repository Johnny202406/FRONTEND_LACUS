import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { RouterLinkActive, RouterOutlet } from '@angular/router';
import { Bk } from '../../services/bk';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { User } from '../../interfaces';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,Button, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  hasMenu = true;
  bk = inject(Bk);
  auth = inject(Auth);

  constructor() {
    this.bk.isHandset$.subscribe((value) => {
      this.hasMenu=false;
    });

  }

  toogleMenu() {
    this.hasMenu = !this.hasMenu;
  }
  dtButton = {
    primary: {
      background: '{primary.whiteMy}',
      color: '{primary.blackMy}',
    },
  };

}
