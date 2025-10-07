import { inject, Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Bk {
  breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.XSmall])
    .pipe(map((result) => result.matches));

  isTablet$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Small])
    .pipe(map((result) => result.matches));

  isWeb$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
    .pipe(map((result) => result.matches));
}
