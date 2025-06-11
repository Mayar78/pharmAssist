import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { enviroments } from '../core/enviroments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class CartService {

   constructor(private _HttpClient:HttpClient) { }

  
  noOfItems2: WritableSignal<number> = signal(0);


  getLoogedUserCart():Observable<any> {
    return this._HttpClient.get(`${enviroments.baseUrl}/api/Baskets`)
  }

  addProductToCart(p_id:number):Observable<any>{
    return this._HttpClient.post(`${enviroments.baseUrl}/api/Baskets/AddProduct?productId=${p_id}`, {'productId': p_id})
  }

  removeItemFormCart(p_id:string):Observable<any>{
   return this._HttpClient.delete(`${enviroments.baseUrl}/api/Baskets/RemoveProduct?productId=${p_id}`)
  }

  updateBasket(countValue:number):Observable<any>{
    return this._HttpClient.post(`${enviroments.baseUrl}/api/Baskets`,{"count": countValue});
  }
  clearCart():Observable<any>{
    return this._HttpClient.delete(`${enviroments.baseUrl}/api/Baskets`)
  }
}