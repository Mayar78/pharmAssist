import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { enviroments } from '../enviroments/enviroment';

// Interface for ingredient filter
export interface IngredientFilter {
  name: string;
  value: string;
  count: number;
}

// Interface for pagination parameters
export interface PaginationParams {
  pageIndex: number;
  pageSize: number;
  sort?: string;
  search?: string;
  ingredients?: string[]; // Add ingredients parameter
}

// Interface for paginated response
export interface PaginatedResponse<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

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

  getAllProductsPaginated(params: PaginationParams): Observable<PaginatedResponse<any>> {
    let httpParams = new HttpParams()
      .set('PageIndex', params.pageIndex.toString())
      .set('PageSize', params.pageSize.toString());

    if (params.sort) {
      httpParams = httpParams.set('Sort', params.sort);
    }

    if (params.search && params.search.trim()) {
      httpParams = httpParams.set('Search', params.search.trim());
    }

    if (params.ingredients && params.ingredients.length > 0) {
   
      httpParams = httpParams.set('Ingredients', params.ingredients.join(','));
      
    }

    return this._HttpClient.get<PaginatedResponse<any>>(
      `${enviroments.baseUrl}/api/Products`, 
      {
        headers: this.headers,
        params: httpParams
      }
    ).pipe(
      catchError(error => {
        console.error('Error in getAllProductsPaginated:', error);
        return throwError(() => error);
      })
    );
  }

  getAllActiveIngredients(): Observable<IngredientFilter[]> {
    return this._HttpClient.get<IngredientFilter[]>(
      `${enviroments.baseUrl}/api/Products/active-ingredients`, 
      {
        headers: this.headers
      }
    ).pipe(
      catchError(error => {
        console.error('Error in getAllActiveIngredients:', error);
        return throwError(() => error);
      })
    );
  }


  getProductDetails(id: string | null): Observable<any> {
    return this._HttpClient.get(`${enviroments.baseUrl}/api/Products/${id}`, { 
      headers: this.headers 
    }).pipe(
      catchError(error => {
        console.error('Error in getProductDetails:', error);
        return throwError(() => error);
      })
    );
  }


  searchProducts(searchTerm: string, params: PaginationParams): Observable<PaginatedResponse<any>> {
    const searchParams = { ...params, search: searchTerm };
    return this.getAllProductsPaginated(searchParams);
  }
}