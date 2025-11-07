import { Component, signal, inject, ViewChild } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Bk } from '../services/bk';
import { Button } from 'primeng/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { Popover, PopoverModule } from 'primeng/popover';
import { Auth } from '../services/auth';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../services/catalog';
@Component({
  selector: 'app-header',
  imports: [
    FormsModule,
    PopoverModule,
    DividerModule,
    IconFieldModule,
    InputIconModule,
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    CommonModule,
    Button,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  bk = inject(Bk);
  auth = inject(Auth);
  catalog = inject(CatalogService);
  router = inject(Router);
  @ViewChild('plink') popover!: Popover;
  @ViewChild('pperfil') popoverPerfil!: Popover;
  icon = signal('pi pi-bars');
  onShow() {
    this.icon.set('pi pi-times');
  }
  onHide() {
    this.icon.set('pi pi-bars');
  }
  constructor() {
    this.bk.isWeb$.subscribe((value) => {
      this.popover?.hide();
    });
    this.auth.user$.subscribe((user) => {
      user === false ? this.popoverPerfil?.hide() : '';
    });
  }

  dtMenuBar = signal({
    root: {
      borderColor: '{primary.green}',
      borderRadius: '0px',
      background: '{primary.green}',
    },
    item: {
      color: '{primary.black}',
      activeColor: '{primary.black}',
    },
    submenu: {
      background: '{primary.green10}',
      borderColor: '{primary.frenchGrey}',
      icon: {
        color: '{primary.black}',
      },
    },
    mobileButton: {
      color: '{primary.whiteMy}',
      borderRadius: '4px',
      hoverColor: '{primary.black}',
      hoverBackground: '{primary.whiteMy}',
    },
  });
  links = signal([
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      url: '/inicio',
    },
    {
      label: 'Categorías',
      icon: '',
      url: '/categorias',
    },
    {
      label: 'Marcas',
      icon: '',
      url: '/marcas',
    },
  ]);
  dtButton = signal({
    primary: {
      background: '{primary.green}',
      borderColor: '{primary.green}',
    },
  });
  dtButtonActive = signal({
    primary: {
      background: '{primary.green10}',
      borderColor: '{primary.whiteMy}',
    },
  });

  dtDivider = signal({
    vertical: {
      margin: '0px',
    },
  });
  dtPopover = signal({
    root: {
      background: '{primary.green}',
      borderColor: '{primary.whiteMy}',
    },
  });

  popup() {
    this.auth.popup();
  }
  logout() {
    this.auth.logout();
  }
  searchInput: string | null = null;
  searchByNameOrCode() {
    this.catalog.searchByNameOrCode(this.searchInput)
  }
}
