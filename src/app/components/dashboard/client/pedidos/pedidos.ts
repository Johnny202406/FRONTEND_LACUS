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
import { TableModule,Table} from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { OrderStatus } from '../../../../interfaces';
import { Order } from '../../../../services/order';

@Component({
  selector: 'app-pedidos',
  imports: [Dialog,CommonModule,InputIconModule, IconFieldModule, InputTextModule, FloatLabelModule, FormsModule,Select,FormsModule,InputTextModule,ButtonModule,DatePicker,TableModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class Pedidos {
  order=inject(Order)
  constructor(
  ) {}
  

  
  maxDate: Date = new Date();

  // date: Date = this.maxDate;
  // selectedEstado: estado_pedidos | undefined;
  // value?: string;

  //  @ViewChild('dt') table!: Table;
   
  //  pedidos: Pedido[] = [];
  //  totalRecords: number = 0;
  //  pageSize:number=5
  //  currentPage: number = 1;
   
  //  search() {
  //    this.currentPage = 1; // Siempre volver a la primera página en una nueva búsqueda
  //    if (this.table) {
  //      this.table.first = 0; // Esto resetea visualmente el paginador
  //    }
  //    this.loadPedidos();
  //  }
   
  //  loadCustomers(event: any) {
  //    if (event) {
  //      this.pageSize = event.rows ?? 5;
  //      this.currentPage = Math.floor((event.first ?? 0) / this.pageSize) + 1;
  //    }
  //    this.loadPedidos();
  //  }
   
   
  // loadPedidos() {
  //   const fecha = this.date ? this.date.toISOString().split('T')[0] : undefined;  
  //   const estadoId = this.selectedEstado ? this.selectedEstado.id : undefined;  

  //   this.dbService.getPedidos(this.currentPage, this.pageSize, fecha, estadoId, this.value).subscribe((response) => {
  //     this.pedidos = response.pedidos;
  //     this.totalRecords = response.totalRecords;
  //   });
  // }

  // pedidoRefer?:Pedido
  //  verDetalles(pedido:Pedido){
  //   return this.pedidoRefer=pedido
  //  }

  // //  ACTUALIZAR PEDIDO
  // position:'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'="top"
  // visibleModal: boolean = false;
  // estadoParaActualizarPedido: estado_pedidos | undefined;
  // selectedPedidos:Pedido[]=[]
  // showDialog() {
  //     this.visibleModal = !this.visibleModal;
      
  // }
    
  // actualizarPedido(){
  //   if(!this.selectedPedidos) return this.alertService.show({ severity: 'warn', summary: 'Pedidos No seleccionados', detail: 'No hay pedidos seleccionados a los que actulizar estado' });
  //   if(!this.estadoParaActualizarPedido) return this.alertService.show({ severity: 'warn', summary: 'Estado No Seleccionado', detail: 'El Estado no se encuentra seleccionado' });
    
  //   const idestado=this.estadoParaActualizarPedido.id
  //   const obj = {
  //     idestado,
  //     pedidos: this.selectedPedidos
  //       .filter(pedido => idestado !== pedido.estado.id) 
  //       .map(pedido => pedido.id) 
  //   };
  //   console.log(obj);
    
  //   if(!obj.pedidos.length) return this.alertService.show({ severity: 'warn', summary: 'Pedidos No seleccionados', detail: 'No hay pedidos seleccionados a los que actualizar con ese estado' });

    
  //   this.dbService.actualizarPedidos(obj).subscribe({
  //       next: () => {
  //         this.loadPedidos()
  //         this.showDialog()
  //         this.selectedPedidos=[]
  //         this.estadoParaActualizarPedido=undefined
  //       },
  //       error: () => {
  //         return this.alertService.show({ severity: 'error', summary: 'Pedido Fallido', detail: 'Pedido no actualizado' });
  //       },
  //       complete:()=>{
  //         return this.alertService.show({ severity: 'success', summary: 'Pedido Actualizado', detail: 'Pedido actualizado con exito' });
          
  //       }
  //     })

  // }  
}
