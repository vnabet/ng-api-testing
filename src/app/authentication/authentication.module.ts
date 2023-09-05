import { environment } from './../../environments/environment';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule, IEnvironment } from '../core';
import { DomainService } from './services/domain.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // CoreModule.forRoot(environment)
  ],
  providers: [
    DomainService
  ]
})
export class AuthenticationModule {

  // public static forRoot(environment:IEnvironment):ModuleWithProviders<CoreModule> {
  //   return {
  //     ngModule: AuthenticationModule,
  //     providers: [
  //     ]
  //   }
  // }
}
