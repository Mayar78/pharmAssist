import { Component } from '@angular/core';
import { ProductAlternative, ProductAlternativesResponse, RecommendationService } from '../../services/recommendation.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alternatives',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './alternatives.component.html',
  styleUrl: './alternatives.component.css'
})
export class AlternativesComponent {
  isLoading = true;
  alternativesData: ProductAlternativesResponse | null = null;
  error: string | null = null;
  productId: number | null = null;

  // Sorting and filtering properties
  sortBy: 'price' | 'savings' | 'effectiveness' | 'safety' = 'savings';
  sortOrder: 'asc' | 'desc' = 'desc';
  showOnlySameIngredient = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recommendationService: RecommendationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('PId');
      if (idParam) {
        this.productId = +idParam;
        console.log('ProductAlternativesComponent initialized with productId:', this.productId);
        this.getProductAlternatives();
      } else {
        this.error = 'Product ID is missing';
        this.isLoading = false;
      }
    });
  }

  getProductAlternatives(): void {
    if (!this.productId) {
      this.error = 'Invalid product ID';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;
    console.log('Making API call for product alternatives ID:', this.productId);
    
    this.recommendationService.getProductAlternatives(this.productId).subscribe({
      next: (response) => {
        console.log('API Response:', response.body);
        this.alternativesData = response.body;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.error = 'Failed to load product alternatives. Please try again later.';
        this.isLoading = false;
      },
      complete: () => console.log('API call completed')
    });
  }

  // Get filtered and sorted alternatives
  get filteredAlternatives(): ProductAlternative[] {
    if (!this.alternativesData?.alternatives) return [];

    let filtered = this.alternativesData.alternatives;

    // Filter by same active ingredient if requested
    if (this.showOnlySameIngredient) {
      filtered = filtered.filter(alt => alt.isSameActiveIngredient);
    }

    // Sort alternatives
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'price':
          comparison = a.productPrice - b.productPrice;
          break;
        case 'savings':
          comparison = a.savingsPercentage - b.savingsPercentage;
          break;
        case 'effectiveness':
          comparison = a.effectivenessScore - b.effectivenessScore;
          break;
        case 'safety':
          comparison = a.safetyScore - b.safetyScore;
          break;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  // Toggle sort order
  toggleSort(sortType: 'price' | 'savings' | 'effectiveness' | 'safety'): void {
    if (this.sortBy === sortType) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortType;
      this.sortOrder = 'desc';
    }
  }

  // Toggle same ingredient filter
  toggleSameIngredientFilter(): void {
    this.showOnlySameIngredient = !this.showOnlySameIngredient;
  }

  // Get savings badge color
  getSavingsBadgeColor(percentage: number): string {
    if (percentage >= 50) return 'high-savings';
    if (percentage >= 25) return 'medium-savings';
    return 'low-savings';
  }

  // Get effectiveness star rating
  getStarRating(score: number): number[] {
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(1); // Full star
      } else if (i === fullStars && hasHalfStar) {
        stars.push(0.5); // Half star
      } else {
        stars.push(0); // Empty star
      }
    }
    
    return stars;
  }

  // Navigate to product details
  viewProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  // Navigate to safety check
  checkProductSafety(productId: number): void {
    this.router.navigate(['/check-safety', productId]);
  }

  // Retry loading alternatives
  retryLoading(): void {
    this.getProductAlternatives();
  }

  // Format price
  formatPrice(price: number): string {
    return `${price.toFixed(2)} EGP`;
  }

  // Get safety score color
  getSafetyScoreColor(score: number): string {
    if (score >= 4.5) return 'excellent';
    if (score >= 4.0) return 'good';
    if (score >= 3.5) return 'fair';
    return 'poor';
  }

  // Track by function for ngFor performance
  trackByProductId(index: number, item: ProductAlternative): number {
    return item.productId;
  }
}