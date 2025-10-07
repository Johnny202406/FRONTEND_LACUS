import { Component, inject } from '@angular/core';
import { Auth as AuthService } from '../../services/auth';
import { Bk } from '../../services/bk';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, InputTextModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  auth=inject(AuthService)
  bk=inject(Bk)

   ngAfterViewInit(): void {
      this.auth.popup();
    }
}
