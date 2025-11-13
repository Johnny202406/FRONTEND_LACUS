import { AfterViewChecked, AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { ENV } from '../../../../env';
import { Brand, Category } from '../../../../interfaces';
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
export class Product implements AfterViewInit,AfterViewChecked,OnInit {
  product = inject(ProductService);
  @ViewChild('dt') table!: Table;
  @ViewChild('fu') fu!: FileUpload;
  @ViewChild('fileUploader') fileUploader!: FileUpload;
 http = inject(HttpClient);
  API_URL = ENV.API_URL;
  private fileUploaderInitialized = false;
  ngOnInit(){
      this.http
          .get(this.API_URL + 'category/findAll', {
            withCredentials: true,
          })
          .subscribe((res) => {
            this.product.categorysAll = res as Category[];
          });
        this.http
          .get(this.API_URL + 'category/findAllEnabled', {
            withCredentials: true,
          })
          .subscribe((res) => {
            this.product.categorysEnabled = res as Category[];
          });
        this.http
          .get(this.API_URL + 'brand/findAll', {
            withCredentials: true,
          })
          .subscribe((res) => {
            this.product.brandsAll = res as Brand[];
          });
          this.http
          .get(this.API_URL + 'brand/findAllEnabled', {
            withCredentials: true,
          })
          .subscribe((res) => {
            this.product.brandsEnabled = res as Brand[];
          });
  }

  ngAfterViewChecked() {
    if (!this.fileUploaderInitialized && this.fileUploader) {
      this.product.setFileUploader(this.fileUploader);
      this.fileUploaderInitialized = true;
    }
  }




  ngAfterViewInit() {
    this.product.setComponents({table: this.table, fu: this.fu, fileUploader: this.fileUploader});
  }

}
