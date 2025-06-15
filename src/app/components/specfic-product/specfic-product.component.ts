import { NgxSpinnerService } from 'ngx-spinner';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { Iproduct } from '../../core/interfaces/iproduct';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CurrencyPipe } from '@angular/common';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-specfic-product',
  standalone: true,
  imports: [CarouselModule, CurrencyPipe],
  templateUrl: './specfic-product.component.html',
  styleUrl: './specfic-product.component.css'
})
export class SpecficProductComponent implements OnInit, OnDestroy {
  
  // Carousel Configuration
  // detailsSlider: OwlOptions = {
  //   loop: true,
  //   mouseDrag: true,
  //   touchDrag: true,
  //   pullDrag: false,
  //   dots: true,
  //   navSpeed: 700,
  //   navText: [
  //     '<i class="fas fa-chevron-left"></i>',
  //     '<i class="fas fa-chevron-right"></i>'
  //   ],
  //   responsive: {
  //     0: {
  //       items: 1
  //     },
  //     400: {
  //       items: 1
  //     },
  //     740: {
  //       items: 1
  //     },
  //     940: {
  //       items: 1
  //     }
  //   },
  //   nav: true,
  //   autoplay: true,
  //   autoplayTimeout: 3000,
  //   autoplayHoverPause: true,
  //   animateOut: 'fadeOut',
  //   animateIn: 'fadeIn'
  // };

  // Dependency Injection
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _toastrService = inject(ToastrService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);
    private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
    productSub!:Subscription;
  

  private readonly _destroy$ = new Subject<void>();

  // Component Properties
  productId: string | null = null;
  detailsData: Iproduct | null = null;
  quantity: number = 1;
  isLoading: boolean = false;
  wishlistIds: string[] = [];

  constructor(
    private _productService: ProductsService,
    private _spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getProductIdFromRoute();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Get product ID from route parameters
   */
  private getProductIdFromRoute(): void {
    this._activatedRoute.paramMap
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (params) => {
          this.productId = params.get('PId');
          if (this.productId) {
            this.getProductDetails();
          } else {
            this._toastrService.error('Product ID not found', 'Error');
          }
        },
        error: (error) => {
          console.error('Error getting route parameters:', error);
          this._toastrService.error('Failed to load product', 'Error');
        }
      });
  }

  /**
   * Fetch product details from service
   */
  private getProductDetails(): void {
    if (!this.productId) return;

    this.isLoading = true;
    this._spinnerService.show();

    this._productService.getProductDetails(this.productId)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response) => {
          this.detailsData = response;
          this.isLoading = false;
          this._spinnerService.hide();
          console.log('Product details loaded:', response);
        },
        error: (error) => {
          console.error('Error fetching product details:', error);
          this.isLoading = false;
          this._spinnerService.hide();
          this._toastrService.error('Failed to load product details', 'Error');
        }
      });
  }

  /**
   * Increase product quantity
   */
  increaseQuantity(): void {
    this.quantity++;
  }

  /**
   * Decrease product quantity
   */
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  /**
   * Update quantity from input field
   */
  updateQuantity(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    
    if (value >= 1) {
      this.quantity = value;
    } else {
      this.quantity = 1;
      target.value = '1';
    }
  }





  
  /**
   * Get product rating as array for displaying stars
   */
  getRatingStars(rating: number = 5): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
  }

  /**
   * Share product
   */
  shareProduct(): void {
    if (!this.detailsData) return;

    if (navigator.share) {
      navigator.share({
        title: this.detailsData.name,
        text: this.detailsData.description,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          this._toastrService.success('Product link copied to clipboard', 'Success');
        })
        .catch(() => {
          this._toastrService.error('Failed to copy link', 'Error');
        });
    }
  }
   addToCart(pId: number): void {

  
  this.productSub = this._CartService.addProductToCart(pId).subscribe({
    next: (res) => {
      // this._NgxSpinnerService.hide();
 this._ToastrService.success('Product added to cart successfully', 'Success');
      // Update cart count
      console.log('Cart updated:', res.items);
    },
    error: (err) => {
      // this._NgxSpinnerService.hide();
      this._ToastrService.error(
        err.error?.message || 'Failed to add product to cart', 
        "Error"
      );
      console.error('Error adding to cart:', err);
    }
  });
}
}