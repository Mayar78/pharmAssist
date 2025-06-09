import { NgxSpinnerService } from 'ngx-spinner';

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../core/services/products.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { Iproduct } from '../../core/interfaces/iproduct';

@Component({
  selector: 'app-allproducts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe, SearchPipe],
  templateUrl: './allproducts.component.html',
  styleUrl: './allproducts.component.css',
})
export class AllproductsComponent implements OnInit, OnDestroy {
  // Dependency Injection
  private readonly _toastrService = inject(ToastrService);
  private readonly _destroy$ = new Subject<void>();

  // Component Properties
  productsData: Iproduct[] = [];
  filteredProducts: Iproduct[] = [];
  searchValue: string = '';
  isLoading: boolean = false;
  wishlistIds: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalProducts: number = 0;

  // View State
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: 'name' | 'price' | 'rating' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private _productsService: ProductsService,
    private _NgxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Load all products from service
   */
  private loadProducts(): void {
    this.isLoading = true;
    this._NgxSpinnerService.show();

    this._productsService
      .getAllProduct()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response) => {
          console.log('Products loaded:', response);
          this.productsData = response.data || response;
          this.filteredProducts = [...this.productsData];
          this.totalProducts = this.productsData.length;
          this.isLoading = false;
          this._NgxSpinnerService.hide();
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoading = false;
          this._NgxSpinnerService.hide();
          this._toastrService.error('Failed to load products', 'Error');
        },
      });
  }

  /**
   * Setup search functionality with debounce
   */
  private setupSearch(): void {
    // Future implementation: Real-time search with debounce
    // This would require converting searchValue to a reactive form control
  }

  /**
   * Filter products based on search value
   */
  onSearchChange(): void {
    if (!this.searchValue.trim()) {
      this.filteredProducts = [...this.productsData];
    } else {
      this.filteredProducts = this.productsData.filter(
        (product) =>
          product.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
      );
    }
    this.currentPage = 1; // Reset to first page
  }

  /**
   * Sort products
   */
  sortProducts(sortBy: 'name' | 'price' | 'rating'): void {
    this.sortBy = sortBy;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

    this.filteredProducts.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'price':
          valueA = a.price;
          valueB = b.price;
          break;
        case 'rating':
          valueA = 4.5; // Default rating since it's not in interface
          valueB = 4.5;
          break;
      }

      if (this.sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }

  /**
   * Add product to cart
   */
  addToCart(product: Iproduct, event: Event): void {
    event.stopPropagation(); // Prevent navigation to product details

    // Uncomment when cart service is implemented
    // this._cartService.addProductToCart(product.id)
    //   .pipe(takeUntil(this._destroy$))
    //   .subscribe({
    //     next: (response) => {
    //       this._toastrService.success(response.message, 'Success');
    //     },
    //     error: (error) => {
    //       this._toastrService.error('Failed to add product to cart', 'Error');
    //     }
    //   });

    // Temporary success message
    this._toastrService.success(`${product.name} added to cart`, 'Success');
    console.log('Adding to cart:', product);
  }

  /**
   * Toggle product in wishlist
   */
  toggleWishlist(product: Iproduct, event: Event): void {
    event.stopPropagation(); // Prevent navigation to product details

    // Uncomment when wishlist service is implemented
    // const action$ = isInWishlist
    //   ? this._wishlistService.removeFromWishlist(product.id)
    //   : this._wishlistService.addToWishlist(product.id);

    // action$.pipe(takeUntil(this._destroy$)).subscribe({
    //   next: () => {
    //     // Success handled above
    //   },
    //   error: (error) => {
    //     this._toastrService.error('Failed to update wishlist', 'Error');
    //   }
    // });
  }

  /**
   * Check if product is in wishlist
   */
  isInWishlist(productId: string): boolean {
    return this.wishlistIds.includes(productId);
  }

  /**
   * Get product rating stars
   */
  getRatingStars(rating: number = 4.5): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, index) => index < Math.floor(rating));
  }

  /**
   * Navigate to product details
   */
  navigateToProduct(productId: string): void {
    // Navigation handled by routerLink in template
  }

  /**
   * Retry loading products
   */
  retryLoad(): void {
    this.loadProducts();
  }

  /**
   * Toggle view mode between grid and list
   */
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  /**
   * Get paginated products
   */
  getPaginatedProducts(): Iproduct[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  /**
   * Get total pages
   */
  getTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  /**
   * Go to specific page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  /**
   * Get page numbers for pagination
   */
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchValue = '';
    this.onSearchChange();
  }

  /**
   * Get products count text
   */
  getProductsCountText(): string {
    const total = this.filteredProducts.length;
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(start + this.itemsPerPage - 1, total);

    return `Showing ${start}-${end} of ${total} products`;
  }
}
