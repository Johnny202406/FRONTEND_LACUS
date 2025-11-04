import { AfterViewChecked, AfterViewInit, Component, inject, ViewChild } from '@angular/core';
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
import { DataView, DataViewModule } from 'primeng/dataview';
import { EntryService } from '../../../../services/entry';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-entry',
  imports: [
    DatePicker,
    InputNumber,
    DataViewModule,
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
  templateUrl: './entry.html',
  styleUrl: './entry.css'
})
export class Entry implements AfterViewInit,AfterViewChecked {
    entry = inject(EntryService);
  
  @ViewChild('dt') tableEntries!: Table;
  @ViewChild('dv') dataView!: DataView;
  
  private dataViewInitialized = false;  

  ngAfterViewChecked() {
    if (!this.dataViewInitialized && this.dataView) {
      this.entry.setDataView(this.dataView);
      this.dataViewInitialized = true;  
    }
  }


  

  ngAfterViewInit() {
    this.entry.setComponents({tableEntries: this.tableEntries, Dataview: this.dataView, });
  }
  
}
