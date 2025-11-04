import { Component, Input } from '@angular/core';
import { Publication } from '../../../interfaces';

@Component({
  selector: 'app-card-publication',
  imports: [],
  templateUrl: './card-publication.html',
  styleUrl: './card-publication.css',
})
export class CardPublication {
  @Input() publication!: Publication;
}
