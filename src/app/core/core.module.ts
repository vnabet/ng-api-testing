import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GatewaysService } from './services/gateways.service';



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
  public static forRoot():ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        GatewaysService
      ]
    }
  }
}
