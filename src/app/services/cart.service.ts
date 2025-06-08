import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroments } from '../core/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private _HttpClient:HttpClient) { }

  
  noOfItems2: WritableSignal<number> = signal(0);


  getLoogedUserCart():Observable<any> {
    return this._HttpClient.get(`${enviroments.baseUrl}/api/v1/cart`)
  }

  addProductToCart(p_id:string):Observable<any>{
    return this._HttpClient.post(`${enviroments.baseUrl}/api/v1/cart`, {'productId': p_id})
  }

  removeItemFormCart(p_id:string):Observable<any>{
   return this._HttpClient.delete(`${enviroments.baseUrl}/api/v1/cart/${p_id}`)
  }

  updateQuantity(p_id:string, countValue:number):Observable<any>{
    return this._HttpClient.put(`${enviroments.baseUrl}/api/v1/cart/${p_id}`,{"count": countValue});
  }
  clearCart():Observable<any>{
    return this._HttpClient.delete(`${enviroments.baseUrl}/api/v1/cart`)
  }
}
