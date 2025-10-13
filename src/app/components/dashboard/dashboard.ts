import { Component, inject, signal } from '@angular/core';
import { Button } from "primeng/button";
import { RouterLinkActive, RouterOutlet } from '@angular/router';
import { Bk } from '../../services/bk';
import { RouterLink } from '@angular/router';

interface links{
  icon:string,
  label:string,
  routerLink:string
}

@Component({
  selector: 'app-dashboard',
  imports: [Button, RouterOutlet, RouterLink,RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  hasMenu = signal(true);
  bk=inject(Bk)

  constructor(){
  //   this.bk.isHandset$.subscribe((value) => {
  //   this.hasMenu.set(false)
  // })
  }
  
  toogleMenu(){
    this.hasMenu.set(!this.hasMenu())
  }
  dtButton = signal({
      primary: {
        background: '{primary.whiteMy}',
        color: '{primary.blackMy}',
      },
    });
  linksClient=signal<links[]>([
    {icon:'pi pi-user',label:'Datos',routerLink:'datos'},
    {icon:'pi pi-shopping-bag',label:'Pedidos',routerLink:'pedidos'}
  ])
}
