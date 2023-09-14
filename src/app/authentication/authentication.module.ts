import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsService } from './services/domains.service';
import { AuthenticationService } from './services/authentication.service';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
  ],
  providers: [
    DomainsService,
    AuthenticationService
  ]
})
export class AuthenticationModule {
}
