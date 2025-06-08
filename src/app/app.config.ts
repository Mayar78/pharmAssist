import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';

export const appConfig: ApplicationConfig = {
 
  providers: [provideRouter(routes, withViewTransitions()), provideToastr(), importProvidersFrom(BrowserAnimationsModule , NgxSpinnerModule ), provideHttpClient(withFetch() , withInterceptors([])), provideClientHydration()]

};
