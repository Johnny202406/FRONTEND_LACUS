import { Component, computed, effect, Signal, signal } from '@angular/core';
import { CountService } from '../services/count-service';

@Component({
  selector: 'app-result',
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.scss',
})
export class Result {
  protected result = signal<null | number>(null);
  protected double: Signal<number | undefined>;
  protected result2: Signal<number | undefined>;

  constructor(private countService: CountService) {
    this.countService.$count.subscribe((value) => this.result.set(value));
    this.result2=this.countService.count2
    this.double = this.countService.double;
    effect(() => {
      console.log(this.result());
    });
  }
}
