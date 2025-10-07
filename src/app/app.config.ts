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
import { provideHttpClient } from '@angular/common/http';

const MyPreset = definePreset(Aura, {
  components: {
    button: {
      root: {
        // primary: {
        //   background: '{primary.green}',
        //   color: '{primary.whiteMy}',
        //   hoverBackground: '{primary.green10}',
        //   hoverColor: '{primary.green}',
        //   activeBackground: '{primary.green10}',
        //   activeColor: '{primary.green}',
        // },
      },
      // colorScheme: {
      //   light: {},
      //   dark: {},
      // },
      
    },
    iconfield:{
      icon:{
        color: '{primary.frenchGrey}',
      }
    },
    inputtext:{
      root:{
        borderColor: '{primary.frenchGrey}',
        hoverBorderColor: '{primary.coolGrey}',
        focusBorderColor: '{primary.green}',
        color: '{primary.black}',
        placeholderColor: '{primary.frenchGrey}',
        borderRadius: '36px',
      }
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
    provideHttpClient(),
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
