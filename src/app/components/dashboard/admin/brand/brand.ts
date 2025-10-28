import { AfterViewInit, Component, inject, OnChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { TableModule, Table } from 'primeng/table';
import { FloatLabel } from 'primeng/floatlabel';

import { FileUploadModule } from 'primeng/fileupload';
import { PrimeNG } from 'primeng/config';
import { FileUpload } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ProgressBar } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Dialog } from 'primeng/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { BrandService } from '../../../../services/brand';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-brand',
  imports: [
    SkeletonModule,
    ImageModule,
    CheckboxModule,
    TextareaModule,
    Dialog,
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
  ],
  templateUrl: './brand.html',
  styleUrl: './brand.css',
})
export class Brand implements AfterViewInit{
  brand = inject(BrandService);
  @ViewChild('dt') table!: Table;
  @ViewChild('fu') fu!: FileUpload;

  ngAfterViewInit() {
    this.brand.setComponents({table: this.table, fu: this.fu});
  }
}
