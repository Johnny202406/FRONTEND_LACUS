import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

const MyPreset = definePreset(Aura, {
  components: {
    button: {
      colorScheme: {
        light: {},
        dark: {},
      },
      root: {
        primary: {
          background: '{primary.red}',
        },
      },
    },
  },
  semantic: {
    primary: {
      green: '#228F47',
      green10: 'rgba(34, 143, 71, 0.1)',
      yellow: '#FFC41F',
      red: '#E14B4B',
      black: '#17183B',
      coolGrey: '#A2A3B1',
      frenchGrey: '#D1D1D8',
      whiteMy: '#FFFFFF',
      whiteMy10: '#f5f5f5',
    },
    colorScheme: {
      light: {
        //...
      },
      dark: {
        //...
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
  ],
};
