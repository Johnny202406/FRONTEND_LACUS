import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  year = new Date().getFullYear();
   services = [
  "Elaboración de planes de Negocio en Estudios Concursables",
  "Prestación de Servicios y Proveedora de bienes",
  "Transferencia de Conocimientos (capacitaciónes, asistencia técnica, etc.)",
  "Nutrición Vegetal y Animal",
  "Procesos Agroindustriales",
  "Semillas de Hortalizas, Pastos, alfalfa y otros",
  "Productos Veterinarios en general",
  "Ferretería, accesorios de riego en general",
  "Se vende cuyes reproductores y pollitos con garantía"
];

}
