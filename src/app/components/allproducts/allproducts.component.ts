import { NgxSpinnerService } from 'ngx-spinner';

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrComponentlessModule, ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../core/services/products.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { Iproduct } from '../../core/interfaces/iproduct';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-allproducts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe, SearchPipe, ],
  templateUrl: './allproducts.component.html',
  styleUrl: './allproducts.component.css',
})
export class AllproductsComponent implements OnInit, OnDestroy {
  

  
  private readonly _CartService = inject(CartService);

  private readonly _destroy$ = new Subject<void>();
  private readonly _searchSubject = new Subject<string>(); 

  productsData: Iproduct[] = [];
  searchValue: string = '';
  isLoading: boolean = false;
  wishlistIds: string[] = [];
  
 
  currentPage: number = 1;
  pageSize: number = 10;
  totalProducts: number = 0;
  totalPages: number = 0;
  productSub!:Subscription;
   loading = false;
  addToCartError: string | null = null;

  // View State
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: 'name' | 'price' | 'rating' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private _productsService: ProductsService,
    private _NgxSpinnerService: NgxSpinnerService, 
    private _ToastrService:ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearch();
  }

  ngOnDestroy(): void {  if (this.productSub) {
    this.productSub.unsubscribe();}
    this._destroy$.next();
    this._destroy$.complete();
  }

  private loadProducts(): void {
    this.isLoading = true;
    this._NgxSpinnerService.show();

    // إنشاء parameters للـ API call مع إضافة البحث
    const params = {
      pageIndex: this.currentPage,
      pageSize: this.pageSize,
      sort: this.getSortParameter(),
      search: this.searchValue.trim() // إضافة قيمة البحث
    };

    this._productsService
      .getAllProductsPaginated(params)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response) => {
          console.log('Products loaded:', response);
          
          this.productsData = response.data || [];
          this.totalProducts = response.count || 0;
          this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
          
          this.isLoading = false;
          this._NgxSpinnerService.hide();
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoading = false;
          this._NgxSpinnerService.hide();
          this._ToastrService.error('Failed to load products', 'Error');
        },
      });
  }

  /**
   * Setup search functionality with debounce
   */
  private setupSearch(): void {
    this._searchSubject
      .pipe(
        debounceTime(500), // انتظار 500ms بعد آخر كتابة
        distinctUntilChanged(), // تجاهل القيم المتكررة
        takeUntil(this._destroy$)
      )
      .subscribe((searchTerm: string) => {
        this.searchValue = searchTerm;
        this.currentPage = 1; // العودة للصفحة الأولى عند البحث
        this.loadProducts(); // إعادة تحميل المنتجات مع البحث
      });
  }

  /**
   * Get sort parameter for API
   */
  private getSortParameter(): string {
    const direction = this.sortOrder === 'asc' ? 'Asc' : 'Desc';
    switch (this.sortBy) {
      case 'name':
        return `Name${direction}`;
      case 'price':
        return `Price${direction}`;
      case 'rating':
        return `Rating${direction}`;
      default:
        return 'NameAsc';
    }
  }

  /**
   * Handle search input change
   */
  onSearchChange(): void {
    // إرسال قيمة البحث إلى Subject
    this._searchSubject.next(this.searchValue);
  }

  /**
   * Handle immediate search (when user clicks search button)
   */
  onSearchSubmit(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  /**
   * Sort products (server-side)
   */
  sortProducts(sortBy: 'name' | 'price' | 'rating'): void {
    if (this.sortBy === sortBy) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }

    this.currentPage = 1;
    this.loadProducts();
  }

 



  getRatingStars(rating: number = 4.5): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, index) => index < Math.floor(rating));
  }
private isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token'); // Adjust based on your auth implementation
  }
  //   addToCart(productId: number): void {
  //   this.loading = true;
  //   this.addToCartError = null;

  //   this._CartService.addProductToCart(productId).subscribe({
  //     next: (cart) => {
  //       console.log('Product added to cart successfully:', cart);
  //       this.loading = false;
        
  //       // Optional: Show success message
  //       // this.showSuccessMessage('Product added to cart!');
  //     },
  //     error: (error) => {
  //       console.error('Error adding product to cart:', error);
  //       this.addToCartError = 'Failed to add product to cart. Please try again.';
  //       this.loading = false;
  //     }
  //   });
  // }
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
   * Go to specific page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadProducts();
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Go to previous page
   */
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  /**
   * Go to next page
   */
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  /**
   * Get page numbers for pagination display
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Check if we should show first page and dots
   */
  shouldShowFirstPage(): boolean {
    return this.getPageNumbers()[0] > 1;
  }

  /**
   * Check if we should show last page and dots
   */
  shouldShowLastPage(): boolean {
    const pageNumbers = this.getPageNumbers();
    return pageNumbers[pageNumbers.length - 1] < this.totalPages;
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchValue = '';
    this._searchSubject.next(''); // إرسال قيمة فارغة للبحث
  }

  /**
   * Get products count text
   */
  getProductsCountText(): string {
    if (this.totalProducts === 0) {
      return this.searchValue ? `No products found for "${this.searchValue}"` : 'No products found';
    }

    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalProducts);

    const searchText = this.searchValue ? ` for "${this.searchValue}"` : '';
    return `Showing ${start}-${end} of ${this.totalProducts} products${searchText}`;
  }

  /**
   * Get current products (server-side pagination - no need for slicing)
   */
  getCurrentProducts(): Iproduct[] {
    return this.productsData;
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