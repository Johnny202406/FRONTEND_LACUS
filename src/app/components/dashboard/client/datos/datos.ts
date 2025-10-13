import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Auth } from '../../../../services/auth';
import { UpdateUser } from '../../../../interfaces';

@Component({
  selector: 'app-datos',
  imports: [ReactiveFormsModule, Button, InputTextModule],
  templateUrl: './datos.html',
  styleUrl: './datos.css',
})
export class Datos {
  auth = inject(Auth);
  private formBuilder = inject(FormBuilder);

  isUpdating = signal(false);
  updating(){
    this.isUpdating.set(true)
  }
  cancelUpdate(){
    this.isUpdating.set(false)
    this.form.reset(this.initialValues())
  }

  form = this.formBuilder.group({
    nombre: [
      this.auth.user()?.nombre ?? null,
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-záéíóúüñ]+(?:\s+[a-záéíóúüñ]+){0,2}$/i),
      ],
    ],
    apellido: [
      this.auth.user()?.apellido ?? null,
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-záéíóúüñ]+(?:\s[a-záéíóúüñ]+)$/i),
      ],
    ],
    dni: [
      this.auth.user()?.dni ?? NaN,
      [Validators.required, Validators.min(10000000), Validators.max(99999999)],
    ],
    numero: [
      this.auth.user()?.numero ?? NaN,
      [Validators.required, Validators.min(900000000), Validators.max(999999999)],
    ],
  });
  initialValues = signal(this.form.getRawValue()); 

  dtButton = signal({
    primary: {
      background: '{primary.green}',
      borderColor: '{primary.green}',
    },
  });
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.auth.updateUser(this.form.value as UpdateUser);
  }
}
