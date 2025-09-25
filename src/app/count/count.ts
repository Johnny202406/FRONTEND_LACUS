import { Component } from '@angular/core';
import { CountService } from '../services/count-service';

@Component({
  selector: 'app-count',
  imports: [],
  templateUrl: './count.html',
  styleUrl: './count.scss',
})
export class Count {
  constructor(private countService: CountService) {}
  sum() {
    this.countService.sum();
  }
  rest() {
    this.countService.rest();
  }
}
