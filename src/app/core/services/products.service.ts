import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { enviroments } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  
  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json'
  });

  constructor(private _HttpClient: HttpClient) {}

  getAllProduct(): Observable<any> {
    return this._HttpClient.get(`${enviroments.baseUrl}/api/Products`, { 
      headers: this.headers 
    });
  }

  getProductDetails(id: string | null): Observable<any> {
    return this._HttpClient.get(`${enviroments.baseUrl}/api/Products/${id}`, { 
      headers: this.headers 
    });
  }
}