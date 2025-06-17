import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroments } from '../enviroments/enviroment';
import { Observable } from 'rxjs/internal/Observable';
//import { Order } from '../interfaces/order';


export interface Order {
  id: number;
  orderDate: string;
  status: number;  
}
@Injectable({
  providedIn: 'root'
})
export class OrderService {
 private baseUrl = enviroments.baseUrl;

  constructor(private http: HttpClient) {}

 
 getUserOrders(): Observable<Order[]> {
    const token = sessionStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.get<Order[]>(`${this.baseUrl}/api/orders`, { headers });
  }

getOrderById(id: number): Observable<Order> {
  const token = sessionStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`
  };

  return this.http.get<Order>(`${this.baseUrl}/api/orders/${id}`, { headers });
}

}