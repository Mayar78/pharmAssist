import { Injectable } from '@angular/core';
import { enviroments } from '../core/enviroments/enviroment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
export interface Recommendation {
  id: number;
  productId: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productPictureUrl: string;
  activeIngredient: string;
  safetyScore: number;
  effectivenessScore: number;
  valueScore: number;
  finalScore: number;
  hasConflict: boolean;
  conflictDetails: string;
  recommendationReason: string;
  createdAt: string;
}

// Interface for recommendations response
export interface RecommendationsResponse {
  recommendations: Recommendation[];
  summary: string;
  totalSafeRecommendations: number;
  totalConflictedItems: number;
  generatedAt: string;
  aiPersonalizedMessage: string;
  confidenceLevel: string;
  keyInsights: string[];
  nextStepsAdvice: string;
}

// Interface for recommendation filter
export interface RecommendationFilter {
  name: string;
  value: string;
  count: number;
}

// Interface for pagination parameters
export interface RecommendationPaginationParams {
  pageIndex: number;
  pageSize: number;
  sort?: string;
  search?: string;
  conflictStatus?: string; // 'safe' | 'conflicted' | 'all'
  scoreRange?: { min: number; max: number };
  ingredients?: string[];
}

// Interface for paginated response
export interface PaginatedRecommendationsResponse<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}
@Injectable({
  providedIn: 'root'
})


export class RecommendationService {
  public headers!: HttpHeaders;

private getAuthHeaders(): HttpHeaders {
  const token = sessionStorage.getItem('token')!;
  return new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
     "ngrok-skip-browser-warning": "true"
  });
}

  constructor(private _HttpClient: HttpClient) {}
private baseUrl = enviroments.baseUrl;

getMyRecommendations(): Observable<any> {
  return this._HttpClient.get(
    `${this.baseUrl}/api/Recommendations/GetMyRecommendations`,
    { headers: this.getAuthHeaders() }
  ).pipe(
    catchError(error => {
      console.error('Error in getMyRecommendations:', error);
      return throwError(() => error);
    })
  );
}
  /**
   * Get recommendations with pagination and filters
   */
  getMyRecommendationsPaginated(params: RecommendationPaginationParams): Observable<PaginatedRecommendationsResponse<Recommendation>> {
    let httpParams = new HttpParams()
      .set('PageIndex', params.pageIndex.toString())
      .set('PageSize', params.pageSize.toString());

    // Add sorting if available
    if (params.sort) {
      httpParams = httpParams.set('Sort', params.sort);
    }

    // Add search if available
    if (params.search && params.search.trim()) {
      httpParams = httpParams.set('Search', params.search.trim());
    }

    // Add conflict status filter
    if (params.conflictStatus && params.conflictStatus !== 'all') {
      httpParams = httpParams.set('ConflictStatus', params.conflictStatus);
    }

    // Add score range filter
    if (params.scoreRange) {
      httpParams = httpParams.set('MinScore', params.scoreRange.min.toString());
      httpParams = httpParams.set('MaxScore', params.scoreRange.max.toString());
    }

    // Add ingredients filter
    if (params.ingredients && params.ingredients.length > 0) {
      httpParams = httpParams.set('Ingredients', params.ingredients.join(','));
    }

    return this._HttpClient.get<PaginatedRecommendationsResponse<Recommendation>>(
      `${enviroments.baseUrl}/api/Recommendations/GetMyRecommendations`,
      {
        headers: this.headers,
        params: httpParams
      }
    ).pipe(
      catchError(error => {
        console.error('Error in getMyRecommendationsPaginated:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get recommendation details by ID
   */
  getRecommendationDetails(id: number): Observable<Recommendation> {
    return this._HttpClient.get<Recommendation>(
      `${enviroments.baseUrl}/api/Recommendations/${id}`,
      { 
        headers: this.getAuthHeaders() 
      }
    ).pipe(
      catchError(error => {
        console.error('Error in getRecommendationDetails:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all unique active ingredients from recommendations for filtering
   */
  getRecommendationIngredients(): Observable<RecommendationFilter[]> {
    return this._HttpClient.get<RecommendationFilter[]>(
      `${enviroments.baseUrl}/api/Recommendations/active-ingredients`,
      {
        headers: this.getAuthHeaders()
      }
    ).pipe(
      catchError(error => {
        console.error('Error in getRecommendationIngredients:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Search recommendations with pagination
   */
  searchRecommendations(searchTerm: string, params: RecommendationPaginationParams): Observable<PaginatedRecommendationsResponse<Recommendation>> {
    const searchParams = { ...params, search: searchTerm };
    return this.getMyRecommendationsPaginated(searchParams);
  }

  /**
   * Filter recommendations by conflict status
   */
  filterByConflictStatus(status: string, params: RecommendationPaginationParams): Observable<PaginatedRecommendationsResponse<Recommendation>> {
    const filterParams = { ...params, conflictStatus: status };
    return this.getMyRecommendationsPaginated(filterParams);
  }

  /**
   * Filter recommendations by score range
   */
  filterByScoreRange(minScore: number, maxScore: number, params: RecommendationPaginationParams): Observable<PaginatedRecommendationsResponse<Recommendation>> {
    const filterParams = { ...params, scoreRange: { min: minScore, max: maxScore } };
    return this.getMyRecommendationsPaginated(filterParams);
  }

  /**
   * Update headers with new token
   */
  updateAuthToken(token: string): void {
    this.headers = this.getAuthHeaders().set('Authorization', `Bearer ${token}`);
  }
}