import { environment } from './../../environments/environment.development';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GatewaysService } from './services/gateways.service';
import { ENVIRONMENT } from './tokens';
import { IEnvironment } from './models';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    GatewaysService
  ]
})
export class CoreModule {
  public static forRoot(environment:IEnvironment):ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        GatewaysService,
        {provide: ENVIRONMENT, useValue: environment}
      ]
    }
  }
}
