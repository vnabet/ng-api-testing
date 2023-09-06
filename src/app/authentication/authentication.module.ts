import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsService } from './services/domains.service';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
  ],
  providers: [
    DomainsService
  ]
})
export class AuthenticationModule {
}
