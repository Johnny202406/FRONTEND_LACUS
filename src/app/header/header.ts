import { Component, signal, Signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  imports: [MenubarModule, BadgeModule, AvatarModule, InputTextModule, Ripple, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  items: Signal<MenuItem[]| undefined>=signal(
    [
            {
                label: 'Home',
                icon: 'pi pi-home',
            },
            {
                label: 'Projects',
                icon: 'pi pi-search',
                badge: '3',
                items: [
                    {
                        label: 'Core',
                        icon: 'pi pi-bolt',
                        shortcut: '⌘+S',
                    },
                    {
                        label: 'Blocks',
                        icon: 'pi pi-server',
                        shortcut: '⌘+B',
                    },
                    {
                        separator: true,
                    },
                    {
                        label: 'UI Kit',
                        icon: 'pi pi-pencil',
                        shortcut: '⌘+U',
                    },
                ],
            },
        ]
  );
  dtMenuBar=signal(
    {
      root:{
        borderColor:"{primary.green}",
        borderRadius:"0px",
        background:"{primary.green}"
      },
      item:{
        color:"{primary.black}",
        activeColor:"{primary.black}"
      },
      submenu:{
        background:"{primary.green10}",
        borderColor:"{primary.frenchGrey}",
        icon:{
          color:"{primary.black}"
        }
      },
      mobileButton:{
        color:"{primary.whiteMy}",
        borderRadius:"4px",
        hoverColor:"{primary.black}",
        hoverBackground:"{primary.whiteMy}",
      }
    }
  )
}
