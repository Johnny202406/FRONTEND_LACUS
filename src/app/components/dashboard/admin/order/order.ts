import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { Order as OrderInterface, OrderStatus } from '../../../../interfaces';
import { OrderService } from '../../../../services/orderAdmin';
import { Popover, PopoverModule } from 'primeng/popover';
import { Skeleton } from "primeng/skeleton";

@Component({
  selector: 'app-order',
   imports: [
    Dialog,
    PopoverModule,
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
    Skeleton
],
  templateUrl: './order.html',
  styleUrl: './order.css'
})
export class Order implements OnInit,AfterViewInit{
  order = inject(OrderService);

  @ViewChild('dt') table!: Table;
  @ViewChild('dtDetails') tableDetails!: Table;

  ngOnInit(){
    this.order.getOrder()
  }
  ngAfterViewInit() {
    this.order.setComponents({table: this.table,});
  }

    @ViewChild('popover') popover!: Popover;
    selectedOrder: OrderInterface | null =null;
    displayComprobante(event: any, order: OrderInterface ) {
        if (this.selectedOrder?.id === order.id) {
            this.popover.hide();
            this.selectedOrder = null;
        } else {
            this.selectedOrder = order;
            this.popover.show(event);

            if (this.popover.container) {
                this.popover.align();
            }
        }
    }

    hidePopover() {
        this.popover.hide();
    }
}

