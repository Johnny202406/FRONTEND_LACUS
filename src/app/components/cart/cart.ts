import { AfterViewChecked, AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { StepperModule } from 'primeng/stepper';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CardProduct } from "./card-product/card-product";
import { SkeletonCardProduct } from "./skeleton-card-product/skeleton-card-product";
import { FloatLabel } from "primeng/floatlabel";
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import * as L from 'leaflet';

@Component({
  selector: 'app-cart',
  imports: [InputTextModule, FileUploadModule, CurrencyPipe, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, InputNumber, StepperModule, CardProduct, SkeletonCardProduct, FloatLabel, SelectModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements AfterViewChecked {
  cart = inject(CartService);
  dtButton = {
    success: {
      background: '{primary.green}',
      borderColor: '{primary.green}',
    },
  };


    @ViewChild('map') map!: L.Map;
    
    private mapInitialized = false;  
  
    ngAfterViewChecked() {
      if (this.map) {
        this.cart.initMap()
      }
    }


}

// import L from 'leaflet';

// // Crear el mapa centrado en un punto predeterminado (Ayacucho)
// const map = L.map('map').setView([13.1581, -74.2235], 13);  // Coordenadas de Ayacucho

// // Agregar una capa de mapa, en este caso OpenStreetMap
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);


// import 'leaflet.draw'; // Asegúrate de importar Leaflet.draw
// import 'leaflet.draw/dist/leaflet.draw.css';

// // Crear el mapa como antes
// const map = L.map('map').setView([13.1581, -74.2235], 13);

// // Agregar la capa de OpenStreetMap
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// // Variables globales para manejar el círculo
// let circle: L.Circle | null = null;

// // Agregar el control de dibujo al mapa
// const drawControl = new L.Control.Draw({
//   draw: {
//     circle: true,    // Habilitar la opción de dibujar un círculo
//     marker: false,   // Deshabilitar el marcador
//     polygon: false,  // Deshabilitar polígonos
//     rectangle: false, // Deshabilitar rectángulos
//     polyline: false  // Deshabilitar líneas
//   },
//   edit: {
//     featureGroup: new L.FeatureGroup() // Permite editar el círculo después de dibujarlo
//   }
// });
// map.addControl(drawControl);

// // Evento para manejar cuando se dibuja el círculo
// map.on(L.Draw.Event.CREATED, function (event) {
//   const layer = event.layer;

//   // Asegurarse de que el círculo no se cree dos veces
//   if (circle) {
//     map.removeLayer(circle);
//   }
// circle.setStyle({
//   color: 'blue',
//   fillColor: '#30f',  // Color de relleno
//   fillOpacity: 0.2,
// });


//   // Establecer el círculo como el nuevo círculo dibujado
//   circle = layer as L.Circle;
//   map.addLayer(circle);

//   // Puedes obtener el centro y radio del círculo como:
//   const center = circle.getLatLng();
//   const radius = circle.getRadius();

//   console.log(`Centro: ${center.lat}, ${center.lng}`);
//   console.log(`Radio: ${radius} metros`);

//   // Aquí podrías guardar el radio y centro en alguna variable para procesar después
// });
