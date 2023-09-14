import { Injectable } from '@angular/core';
import { ILoginPayload } from '../models/login-payload';

@Injectable()
export class AuthenticationService {

  constructor() { }

  loginV2(payload:ILoginPayload) {

    console.log('payload', payload)

  }
}
