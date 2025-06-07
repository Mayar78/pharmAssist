import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroments } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private _HttpClient:HttpClient) {}
    getAllProduct():Observable<any>{
    return this._HttpClient.get(`${enviroments.baseUrl}/api/Products`);
  }

  getProductDetails(id:string|null):Observable<any>{
    return this._HttpClient.get(`${enviroments.baseUrl}/api/Products/${id}`)
  }
}
