import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroments } from '../enviroments/enviroment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
 private baseUrl = enviroments.baseUrl;

  constructor(private http: HttpClient) {}

  getUserOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/RequestOrder`);
  }
}