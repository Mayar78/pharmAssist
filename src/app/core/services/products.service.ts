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

  /**
   * Get all products without pagination (original method)
   */
  getAllProduct(): Observable<any> {
    return this._HttpClient.get(`${enviroments.baseUrl}/api/Products`, { 
      headers: this.headers 
    });
  }

  /**
   * Get all products with pagination
   */
  getAllProductsPaginated(params: PaginationParams): Observable<PaginatedResponse<any>> {
    let httpParams = new HttpParams()
      .set('PageIndex', params.pageIndex.toString())
      .set('PageSize', params.pageSize.toString());

    // إضافة الفرز إذا كان متوفراً
    if (params.sort) {
      httpParams = httpParams.set('Sort', params.sort);
    }

    // إضافة البحث إذا كان متوفراً
    if (params.search && params.search.trim()) {
      httpParams = httpParams.set('Search', params.search.trim());
    }

    // إضافة فلتر المكونات النشطة إذا كان متوفراً
    if (params.ingredients && params.ingredients.length > 0) {
      // Send ingredients as comma-separated string or multiple parameters
      // Method 1: Comma-separated
      httpParams = httpParams.set('Ingredients', params.ingredients.join(','));
      
      // Method 2: Multiple parameters (uncomment if your API expects this format instead)
      // params.ingredients.forEach(ingredient => {
      //   httpParams = httpParams.append('Ingredients', ingredient);
      // });
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

  /**
   * Get all unique active ingredients for filtering
   */
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

  /**
   * Get product details by ID
   */
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

  /**
   * Search products with pagination
   */
  searchProducts(searchTerm: string, params: PaginationParams): Observable<PaginatedResponse<any>> {
    const searchParams = { ...params, search: searchTerm };
    return this.getAllProductsPaginated(searchParams);
  }
}