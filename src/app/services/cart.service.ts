import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpHeaders }        from '@angular/common/http';
import { BehaviorSubject, Observable }                     from 'rxjs';
import { catchError, tap }                            from 'rxjs/operators';
import { ICart }                          from '../interfaces/icart';
import { enviroments }                    from '../core/enviroments/enviroment';



@Injectable({ providedIn: 'root' })
export class CartService {
 
  noOfItems2: WritableSignal<number> = signal(0);
  constructor(private _HttpClient: HttpClient) {}
  private lastQuantity = 1;

private getAuthHeaders(): HttpHeaders {
  const token = sessionStorage.getItem('token')!;
  return new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
     "ngrok-skip-browser-warning": "true"
  });
}


getLoogedUserCart():Observable<any> {
    return this._HttpClient.get(`${enviroments.baseUrl}/api/Baskets`,{headers: this.getAuthHeaders()})
  }

 addProductToCart(p_id: number): Observable<any> {
  // أضف headers بشكل صحيح وأرسل body إذا كان مطلوباً
  return this._HttpClient.post(
    `${enviroments.baseUrl}/api/Baskets/AddProduct?productId=${p_id}`, 
    {}, // أضف body هنا إذا كان مطلوباً
    { headers: this.getAuthHeaders() }
  ).pipe(
    tap(() => this.noOfItems2.update(value => value + 1)), // تحديث العداد
    catchError(error => {
      console.error('Error adding to cart:', error);
      throw error;
    })
  );
}

  removeItemFormCart(p_id:number):Observable<any>{
   return this._HttpClient.delete(`${enviroments.baseUrl}/api/Baskets/RemoveProduct?productId=${p_id}`, {headers: this.getAuthHeaders()});  
  }

update(p_id: string, countValue: number): Observable<ICart> {
  return this._HttpClient.put<ICart>(
    `${enviroments.baseUrl}/api/Baskets/UpdateProduct`,
    { productId: +p_id, quantity: countValue },
    { headers: this.getAuthHeaders() }
  );
}
  clearCart():Observable<any>{
    return this._HttpClient.delete(`${enviroments.baseUrl}/api/Baskets`, {headers: this.getAuthHeaders()});
  }
}