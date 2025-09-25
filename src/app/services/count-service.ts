import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountService {
  constructor() {}

  count = new BehaviorSubject<number>(5);
  $count = this.count.asObservable();
  count2 = toSignal(this.$count);
  double = toSignal(this.count.pipe(map((value: number) => value * 2)));

  sum() {
    this.count.next(this.count.value + 1);
  }

  rest() {
    if (this.count.value == 0) return;
    this.count.next(this.count.value - 1);
  }
}
