import { Component, inject, signal } from '@angular/core';
import { Auth as AuthService } from '../../services/auth';
import { Bk } from '../../services/bk';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  auth = inject(AuthService);
  bk = inject(Bk);
  // private formBuilder = inject(FormBuilder);
  // form = this.formBuilder.group({
  //   dni: [ NaN, [Validators.required, Validators.min(10000000), Validators.max(99999999)]],
  //   numero: [NaN, [Validators.required, Validators.min(900000000), Validators.max(999999999)]],
  // });
  // dtButton = signal({
  //   primary: {
  //     background: '{primary.green}',
  //     borderColor: '{primary.green}',
  //   },
  // });

  listItem=signal(Array(10))
  ngAfterViewInit(): void {
    this.auth.popup();
  }

  // onSubmit() {
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }
    
  // }
}
