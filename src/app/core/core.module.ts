import { environment } from './../../environments/environment.development';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GatewaysService } from './services/gateways.service';
import { ENVIRONMENT } from './tokens';
import { IEnvironment } from './models';
import { ApiInterceptorService } from './services';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    GatewaysService,
    ApiInterceptorService
  ]
})
export class CoreModule {
  public static forRoot(environment:IEnvironment):ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        GatewaysService,
        {provide: ENVIRONMENT, useValue: environment},
        {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true}

      ]
    }
  }
}
