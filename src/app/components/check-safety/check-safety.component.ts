import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecommendationService } from '../../services/recommendation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-check-safety',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './check-safety.component.html',
  styleUrl: './check-safety.component.css'
})
export class CheckSafetyComponent {
 isLoading = true;
  productInfo: any;
  error: string | null = null;
 productId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private recommendationService: RecommendationService
  ) {}

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const idParam = params.get('PId');
    if (idParam) {
      this.productId = +idParam; 
      console.log('CheckSafetyComponent initialized with productId:', this.productId);
      this.checkProductSafety();
    } else {
      this.error = 'Product ID is missing';
      this.isLoading = false;
    }
  });
}

checkProductSafety(): void {
  if (!this.productId) {
    this.error = 'Invalid product ID';
    this.isLoading = false;
    return;
  }

  this.isLoading = true;
  this.error = null;
  console.log('Making API call for product ID:', this.productId);
  this.recommendationService.checkProductSafety(this.productId).subscribe({
    next: (response) => {
      console.log('API Response:', response.body);
      this.productInfo = response.body;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('API Error:', err);
      this.error = 'Failed to check product safety. Please try again later.';
      this.isLoading = false;
    },
    complete: () => console.log('API call completed')
  });
}
  }
