import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule, Table } from 'primeng/table';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import {  InputIcon } from 'primeng/inputicon';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { UserService } from '../../../../services/user';
@Component({
  selector: 'app-user',
  imports: [
    SkeletonModule,
    ImageModule,
    CheckboxModule,
    TextareaModule,
    FormsModule,
    SelectModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    FloatLabel,
    ButtonModule,
    BadgeModule,
    CommonModule,
    FileUploadModule,
    ProgressSpinnerModule,
    FileUploadModule,
    IconField,
    InputIcon
],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User implements AfterViewInit{
  user = inject(UserService);
  @ViewChild('dt') table!: Table;

  ngAfterViewInit() {
    this.user.setComponents({table: this.table});
  }
}
