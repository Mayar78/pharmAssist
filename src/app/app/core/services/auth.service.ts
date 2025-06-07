import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroments } from '../../../core/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 constructor(private _HttpClient:HttpClient) { }

  register(userData:object):Observable<any>{
    return this._HttpClient.post(`${enviroments.baseUrl}/api/Accounts/Register`,userData)
  }
  }

