// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { catchError, Observable, throwError } from 'rxjs';
// import { enviroments } from '../enviroments/enviroment';

// @Injectable({
//   providedIn: 'root'
// })
// export interface PaginatedResponse<T> {
//   pageIndex: number;
//   pageSize: number;
//   count: number;
//   data: T[];
// }
// export interface PaginationParams {
//   pageIndex: number;
//   pageSize: number;
//   sort?: string;
//   search?: string;
// }


// export class ProductsService {
  
//   private headers = new HttpHeaders({
//     'ngrok-skip-browser-warning': 'true',
//     'Content-Type': 'application/json'
//   });

//   constructor(private _HttpClient: HttpClient) {}


// // Interface for paginated response

  
 

//   /**
//    * Get all products without pagination (original method)
//    */
//   getAllProduct(): Observable<any> {
//     return this._HttpClient.get(`${enviroments.baseUrl}/api/Products`, { 
//       headers: this.headers 
//     });
//   }

//   /**
//    * Get all products with pagination
//    */
//   getAllProductsPaginated(params: PaginationParams): Observable<PaginatedResponse<any>> {
//     let httpParams = new HttpParams()
//       .set('PageIndex', params.pageIndex.toString())
//       .set('PageSize', params.pageSize.toString());

//     // إضافة الفرز إذا كان متوفراً
//     if (params.sort) {
//       httpParams = httpParams.set('Sort', params.sort);
//     }

//     // إضافة البحث إذا كان متوفراً
//     if (params.search && params.search.trim()) {
//       httpParams = httpParams.set('Search', params.search.trim());
//     }

//     return this._HttpClient.get<PaginatedResponse<any>>(
//       `${enviroments.baseUrl}/api/Products`, 
//       { 
//         headers: this.headers,
//         params: httpParams
//       }
//     ).pipe(
//       catchError(error => {
//         console.error('Error in getAllProductsPaginated:', error);
//         return throwError(() => error);
//       })
//     );
//   }
// getProductDetails(id: string | null): Observable<any> {
  //   return this._HttpClient.get(`${enviroments.baseUrl}/api/Products/${id}`, { 
  //     headers: this.headers 
  //   }).pipe(
  //     catchError(error => {
  //       console.error('Error in getProductDetails:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

  /**
   * Search products with pagination
   */
  // searchProducts(searchTerm: string, params: PaginationParams): Observable<PaginatedResponse<any>> {
  //   const searchParams = { ...params, search: searchTerm };
  //   return this.getAllProductsPaginated(searchParams);
  

  // getAllProduct(currentPage: number = 1): Observable<any> {
  //   return this._HttpClient.get(`${enviroments.baseUrl}/api/Products`, { 
  //     headers: this.headers 
  //   });
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { enviroments } from '../enviroments/enviroment';

// Interface for pagination parameters
export interface PaginationParams {
  pageIndex: number;
  pageSize: number;
  sort?: string;
  search?: string;
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
}  // }

  // getProductDetails(id: string | null): Observable<any> {
  //   return this._HttpClient.get(`${enviroments.baseUrl}/api/Products/${id}`, { 
  //     headers: this.headers 
  //   });
  // }
  
