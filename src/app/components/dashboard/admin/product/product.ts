import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule, Table } from 'primeng/table';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import {  InputIcon } from 'primeng/inputicon';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUpload } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Dialog } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { ProductService } from '../../../../services/product';
import { ProgressBar } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
@Component({
  selector: 'app-product',
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
      IconField,
      InputIcon,
      ProgressBar,
      MessageModule
  ],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product implements AfterViewInit{
  product = inject(ProductService);
  @ViewChild('dt') table!: Table;
  @ViewChild('fu') fu!: FileUpload;
  @ViewChild('fileUploader') fileUploader!: FileUpload;

  ngAfterViewInit() {
    this.product.setComponents({table: this.table, fu: this.fu, fileUploader: this.fileUploader});
  }
}
