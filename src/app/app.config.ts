import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
 
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },provideRouter(routes, withViewTransitions()), provideToastr(), importProvidersFrom(BrowserAnimationsModule , NgxSpinnerModule ), provideHttpClient(withFetch() , withInterceptors([])), provideClientHydration()]

};
