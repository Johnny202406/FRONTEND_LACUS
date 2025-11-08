import { AfterViewChecked, AfterViewInit, Component, inject } from '@angular/core';
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


  ngAfterViewChecked() {
    this.initMap();
  }

  mensaje: string = '';
  coordenadas: { lat: number; lng: number } | null = null;
  private map!: L.Map;
private tienda = { lat: -13.1700, lng: -74.2200 };


  private radio = 3500;
  private marcadorActual: L.Marker | null = null;
  private initMap(): void {
    this.map = L.map('map').setView([this.tienda.lat, this.tienda.lng], 16);
    console.log(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Círculo delimitando zona
    const zona = L.circle([this.tienda.lat, this.tienda.lng], {
      color: 'blue',
      fillColor: '#add8e6',
      fillOpacity: 0.3,
      radius: this.radio
    }).addTo(this.map);

    // Marcador de la tienda
    L.marker([this.tienda.lat, this.tienda.lng]).addTo(this.map).bindPopup('Tienda');

    // Click en el mapa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const distancia = (this.map as L.Map).distance([lat, lng], [this.tienda.lat, this.tienda.lng]);

      if (distancia <= this.radio) {
        this.mensaje = 'Selección válida dentro de la zona.';
        this.coordenadas = { lat, lng };

        // Si ya existe un marcador, lo eliminamos
        if (this.marcadorActual) {
          this.map.removeLayer(this.marcadorActual);  // Eliminar el marcador anterior
        }

        // Agregar el nuevo marcador
        this.marcadorActual = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            iconSize: [32, 32]
          })
        }).addTo(this.map);  // Almacena el marcador actual en la propiedad
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

        fetch(url)
          .then(response => response.json())
          .then(data => {
            const direccion = data.display_name;  // La dirección completa
            console.log('Dirección:', direccion);
            this.mensaje = direccion;
          })
          .catch(error => console.error('Error al obtener la dirección:', error));

      } else {
        this.mensaje = '⚠ Selección fuera de la zona permitida.';
      }
    });
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
