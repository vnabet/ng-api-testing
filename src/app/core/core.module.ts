import { environment } from './../../environments/environment.development';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GatewaysService } from './services/gateways.service';
import { ENVIRONMENT } from './tokens';
import { IEnvironment } from './models';
import { ApiInterceptorService } from './services/api-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptorService } from './services/loading-interceptor.service';
import { HttpStateService } from './services';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CoreModule {
  public static forRoot(environment:IEnvironment):ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,

      providers: [
        ApiInterceptorService,
        HttpStateService,
        GatewaysService,
        {provide: ENVIRONMENT, useValue: environment},
        {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true},

      ]
    }
  }
}
