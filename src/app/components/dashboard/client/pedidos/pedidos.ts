import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Router } from '@angular/router';
import { TableModule, Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { OrderStatus } from '../../../../interfaces';
import { OrderService } from '../../../../services/order';

@Component({
  selector: 'app-pedidos',
  imports: [
    CommonModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    Select,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DatePicker,
    TableModule,
  ],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos {
  order = inject(OrderService);

  @ViewChild('dt') table!: Table;
  @ViewChild('dtDetails') tableDetails!: Table;
}
