
import { Injectable, signal, WritableSignal } from '@angular/core';
import { enviroments } from '../core/enviroments/enviroment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
export interface ProductSafetyResponse {
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

export interface IncompleteProfileResponse {
  isProfileComplete: boolean;
  message: string;
  title: string;
  missingFields: string[];
  actionRequired: string;
  generatedAt: string;
}

export interface SafetySummaryResponse {
  totalSafeRecommendations: number;
  totalConflictedItems: number;
  summary: string;
  topRecommendation: {
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
  };
  generatedAt: string;
  aiPersonalizedMessage: string;
  overallRiskAssessment: string;
  safetyHighlights: string[];
  recommendedAction: string;
}
export interface SafetySummaryResponse {
  isProfileComplete: boolean;
  message: string;
  title: string;
  missingFields: string[];
  actionRequired: string;
  generatedAt: string;
}

export interface CompleteSafetySummaryResponse {
  totalSafeRecommendations: number;
  totalConflictedItems: number;
  summary: string;
  topRecommendation: {
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
  };
  generatedAt: string;
  aiPersonalizedMessage: string;
  overallRiskAssessment: string;
  safetyHighlights: string[];
  recommendedAction: string;
}
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  activeIngredient: string;
}

// src/app/shared/models/medication-recommendation.model.ts
export interface MedicationRecommendation {
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

// src/app/shared/models/profile-incomplete.model.ts
export interface ProfileIncompleteResponse {
  isProfileComplete: false;
  message: string;
  title: string;
  missingFields: string[];
  actionRequired: string;
  generatedAt: string;
}
export interface ConflictingMedication extends Recommendation {
 
  conflictDetails: string;
}
export interface ConflictingMedicationsResponse {
  conflictingMedications: ConflictingMedication[];
  totalConflictingItems: number;
  summary: string;
  generatedAt: string;
  aiPersonalizedMessage: string;
  conflictWarnings: string[];
  safetyAdvice: string[];
}

@Injectable({
  providedIn: 'root'
})


export class RecommendationService {
  
   constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token')!;
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "true"
    });
  }

  getSafetySummary(): Observable<SafetySummaryResponse | CompleteSafetySummaryResponse> {
    return this.http.get<SafetySummaryResponse | CompleteSafetySummaryResponse>(
      `${enviroments.baseUrl}/api/Recommendations/GetSafetySummary`,
      { headers: this.getAuthHeaders() }
    );
  }

  getMyRecommendations(): Observable<any> {
    return this.http.get(`${enviroments.baseUrl}/api/Recommendations/GetMyRecommendations/`, 
      { headers: this.getAuthHeaders() });
  }
    getConflictingMedications(maxResults: number = 50): Observable<IncompleteProfileResponse | ConflictingMedicationsResponse> {
    return this.http.get<IncompleteProfileResponse | ConflictingMedicationsResponse>(
      `${enviroments.baseUrl}/api/Recommendations/GetConflictingMedications`,
      { 
        headers: this.getAuthHeaders(),
        params: { maxResults: maxResults.toString() }
      }
    );
  }

  // In RecommendationService
// In RecommendationService
checkProductSafety(productId: number): Observable<any> {
  return this.http.get(
    `${enviroments.baseUrl}/api/Recommendations/CheckProductSafety/${productId}`,
    { 
      headers: this.getAuthHeaders(),
      observe: 'response' // Get full response for debugging
    }
  );

}
}