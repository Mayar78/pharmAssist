import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

// Interfaces based on your API responses
export interface ICartItem {
  id: number;
  name: string;
  pictureUrl: string;
  activeIngredient: string;
  price: number;
  quantity: number;
}

export interface ICart {
  id: string;
  items: ICartItem[];
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);

  // Component State
  cartData: ICart | null = null;
  cartItems: ICartItem[] = [];
  cartSub!: Subscription;
  isLoading: boolean = false;
  isUpdating: boolean = false;
  
  // Confirmation Modal Properties
  confirmationMessage: string = '';
  pendingAction: (() => void) | null = null;

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

  /**
   * Load user's cart data
   */
  loadCart(): void {
    this.isLoading = true;
    this._NgxSpinnerService.show();

    this.cartSub = this._CartService.getLoogedUserCart().subscribe({
      next: (res) => {
        console.log("Cart data loaded:", res);
        this.cartData = res.data || res; // Handle different response structures
        this.cartItems = this.cartData?.items || [];
        this.isLoading = false;
        this._NgxSpinnerService.hide();
        
        // Update cart count in service
        this._CartService.noOfItems2.set(this.getTotalQuantity());
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.isLoading = false;
        this._NgxSpinnerService.hide();
        this._ToastrService.error('Failed to load cart', 'Error');
      }
    });
  }

  /**
   * Clear all items from cart
   */
  clearAllCart(): void {
    if (!this.cartItems || this.cartItems.length === 0) {
      this._ToastrService.info('Cart is already empty', 'Info');
      return;
    }

    this.confirmationMessage = 'Are you sure you want to clear all items from your cart?';
    this.pendingAction = () => this.performClearCart();
    this.showConfirmationModal();
  }

  private performClearCart(): void {
    this.isUpdating = true;
    this._NgxSpinnerService.show();

    this._CartService.clearCart().subscribe({
      next: (res) => {
        console.log('Cart cleared:', res);
        this.cartItems = [];
        this.cartData = null;
        this._CartService.noOfItems2.set(0);
        this.isUpdating = false;
        this._NgxSpinnerService.hide();
        this._ToastrService.success('Cart cleared successfully', 'Success');
      },
      error: (err) => {
        console.error('Error clearing cart:', err);
        this.isUpdating = false;
        this._NgxSpinnerService.hide();
        this._ToastrService.error('Failed to clear cart', 'Error');
      }
    });
  }

  /**
   * Remove specific item from cart
   */
  deleteItem(productId: string | number): void {
    const item = this.cartItems.find(item => item.id == productId);
    if (!item) {
      this._ToastrService.error('Item not found in cart', 'Error');
      return;
    }

    this.confirmationMessage = `Are you sure you want to remove "${item.name}" from your cart?`;
    this.pendingAction = () => this.performDeleteItem(productId);
    this.showConfirmationModal();
  }

  private performDeleteItem(productId: string | number): void {
    this.isUpdating = true;
    this._NgxSpinnerService.show();

    this._CartService.removeItemFormCart(productId.toString()).subscribe({
      next: (res) => {
        console.log('Item removed:', res);
        
        // Update local cart data
        this.cartItems = this.cartItems.filter(item => item.id != productId);
        if (this.cartData) {
          this.cartData.items = this.cartItems;
        }
        
        // Update cart count
        this._CartService.noOfItems2.update((value) => Math.max(0, value - 1));
        
        this.isUpdating = false;
        this._NgxSpinnerService.hide();
        this._ToastrService.success('Item removed from cart', 'Success');
      },
      error: (err) => {
        console.error('Error removing item:', err);
        this.isUpdating = false;
        this._NgxSpinnerService.hide();
        this._ToastrService.error('Failed to remove item', 'Error');
      }
    });
  }

  /**
   * Update item quantity
   */
  updateQuantity(productId: string | number, newQuantity: number | string): void {
    const quantity = typeof newQuantity === 'string' ? parseInt(newQuantity, 10) : newQuantity;
    
    if (isNaN(quantity) || quantity < 1) {
      this._ToastrService.warning('Quantity must be at least 1', 'Warning');
      return;
    }

    if (quantity > 99) {
      this._ToastrService.warning('Maximum quantity is 99', 'Warning');
      return;
    }

    this.isUpdating = true;
    this._NgxSpinnerService.show();

    this._CartService.updateBasket(quantity).subscribe({
      next: (res) => {
        console.log('Quantity updated:', res);
        
        // Update local item quantity
        const itemIndex = this.cartItems.findIndex(item => item.id == productId);
        if (itemIndex !== -1) {
          const oldQuantity = this.cartItems[itemIndex].quantity;
          this.cartItems[itemIndex].quantity = quantity;
          
          // Update cart count based on quantity difference
          const quantityDiff = quantity - oldQuantity;
          this._CartService.noOfItems2.update((value) => Math.max(0, value + quantityDiff));
        }
        
        this.isUpdating = false;
        this._NgxSpinnerService.hide();
        this._ToastrService.success('Quantity updated', 'Success');
      },
      error: (err) => {
        console.error('Error updating quantity:', err);
        this.isUpdating = false;
        this._NgxSpinnerService.hide();
        this._ToastrService.error('Failed to update quantity', 'Error');
        // Reload cart to ensure consistency
        this.loadCart();
      }
    });
  }

  /**
   * Calculate total cart value
   */
  getCartTotal(): number {
    if (!this.cartItems || this.cartItems.length === 0) return 0;
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * Calculate total quantity of items
   */
  getTotalQuantity(): number {
    if (!this.cartItems || this.cartItems.length === 0) return 0;
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Refresh cart data
   */
  refreshCart(): void {
    this.loadCart();
    this._ToastrService.info('Cart refreshed', 'Info');
  }

  /**
   * Proceed to checkout
   */
  proceedToCheckout(): void {
    if (!this.cartItems || this.cartItems.length === 0) {
      this._ToastrService.warning('Your cart is empty', 'Warning');
      return;
    }

    // Implement checkout logic here
    this._ToastrService.info('Checkout functionality to be implemented', 'Info');
  }

  /**
   * Handle image loading errors
   */
  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder.jpg';
  }

  /**
   * TrackBy function for ngFor optimization
   */
  trackByItemId(index: number, item: ICartItem): number {
    return item.id;
  }

  /**
   * Show confirmation modal
   */
  private showConfirmationModal(): void {
    // Using Bootstrap modal (make sure Bootstrap JS is imported)
    const modalElement = document.getElementById('confirmModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  /**
   * Execute pending confirmation action
   */
  confirmAction(): void {
    if (this.pendingAction) {
      this.pendingAction();
      this.pendingAction = null;
    }
  }
}