import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IncompleteProfileResponse,
  RecommendationService,
  RecommendationsResponse,
  Recommendation
} from '../../services/recommendation.service';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-get-my-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './get-my-recommendations.component.html',
  styleUrls: ['./get-my-recommendations.component.css']
})
export class GetMyRecommendationsComponent implements OnInit {
  fullResponse!: RecommendationsResponse;
  recommendations: Recommendation[] = [];
  summary = '';
  isLoading = true;
  error: string | null = null;
    productSub!:Subscription;

  profileComplete = true;
  incompleteProfileData: IncompleteProfileResponse | null = null;

  constructor(private recommendationsService: RecommendationService) { }
   private readonly _CartService = inject(CartService);
    private readonly _ToastrService = inject(ToastrService);
    private readonly _Router = inject(Router);

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    this.error = null;
    this.isLoading = true;

    this.recommendationsService.getMyRecommendations().subscribe({
      next: (response) => {
        if ('isProfileComplete' in response && !response.isProfileComplete) {
          this.profileComplete = false;
          this.incompleteProfileData = response as IncompleteProfileResponse;
        } else {
          this.profileComplete = true;
          this.fullResponse = response as RecommendationsResponse;
          this.recommendations = this.fullResponse.recommendations;
          this.summary = this.fullResponse.summary;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load recommendations. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  completeProfile(): void {
    this._Router.navigate(['/main/side-effects-questions']);
    console.log('Redirect to profile completion');
  }
     addToCart(pId: number): void {

  
  this.productSub = this._CartService.addProductToCart(pId).subscribe({
    next: (res) => {
   
 this._ToastrService.success('Product added to cart successfully', 'Success');
      // Update cart count
      console.log('Cart updated:', res.items);
    },
    error: (err) => {
    
      this._ToastrService.error(
        err.error?.message || 'Failed to add product to cart', 
        "Error"
      );
      console.error('Error adding to cart:', err);
    }
  });
}
}
