import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartService } from '../../services/cart.service';
import { ICart, ICartItem } from '../../interfaces/icart';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

interface StoredCartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  activeIngredient?: string;
  pictureUrl?: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);

  cartData: ICart | null = null;
  username = sessionStorage.getItem('displayName');
  cartSub!: Subscription;
  showModal: boolean = false;
  totalPrice!: number;

  private saveCartToLocalStorage(): void {
    if (this.cartData?.items) {
      const cartItems: StoredCartItem[] = this.cartData.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        activeIngredient: item.activeIngredient,
        pictureUrl: item.pictureUrl
      }));

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      localStorage.setItem('cartTotal', this.calculateTotal().toString());

      console.log('Cart saved to localStorage:', cartItems);
    } else {
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartTotal');
    }
  }

  getCartFromLocalStorage(): StoredCartItem[] {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  }

  getCartTotalFromLocalStorage(): number {
    const storedTotal = localStorage.getItem('cartTotal');
    return storedTotal ? parseFloat(storedTotal) : 0;
  }

  private clearCartFromLocalStorage(): void {
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartTotal');
    console.log('Cart cleared from localStorage');
  }

  getTotalItemCount(): number {
    if (!this.cartData?.items) return 0;
    const totalCount = this.cartData.items.reduce((total, item) => total + item.quantity, 0);
    sessionStorage.setItem('cartItemCount', totalCount.toString());
    return totalCount;
  }

  showClearCartModal(): void {
    this.showModal = true;
  }

  hideClearCartModal(): void {
    this.showModal = false;
  }

  hideModalOnBackdrop(event: Event): void {
    if (event.target === event.currentTarget) {
      this.hideClearCartModal();
    }
  }

  confirmClearCart(): void {
    this._NgxSpinnerService.show();
    this._CartService.clearCart().subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this.cartData = res;
        this._CartService.noOfItems2.set(0);
        sessionStorage.setItem('cartItemCount', '0');
        this.clearCartFromLocalStorage();
        this._ToastrService.success('Cart cleared successfully', 'Success');
        this.hideClearCartModal();
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
        this._ToastrService.error(err.error?.message || 'Error clearing cart', 'Error');
        this.hideClearCartModal();
      }
    });
  }

  deleteItem(p_id: number): void {
    this._NgxSpinnerService.show();
    this._CartService.removeItemFormCart(p_id).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this.cartData = res;
        this._ToastrService.success(res.message, 'Deleted Successfully');
        const itemCount = this.getTotalItemCount();
        this._CartService.noOfItems2.set(itemCount);
        this.saveCartToLocalStorage();
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
        this._ToastrService.error(err.error?.message, 'Error');
      }
    });
  }

  updateQuantity(p_id: number, newQuantity: number): void {
    if (newQuantity < 1) return;

    this._NgxSpinnerService.show();
    this._CartService.update(p_id.toString(), newQuantity).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this.cartData = res;
        const itemCount = this.getTotalItemCount();
        this._CartService.noOfItems2.set(itemCount);
        this.saveCartToLocalStorage();
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
        console.error('Error updating quantity:', err);
        this._ToastrService.error('Error updating quantity', 'Error');
      }
    });
  }

  ngOnInit(): void {
    const savedCartCount = sessionStorage.getItem('cartItemCount');
    if (savedCartCount) {
      this._CartService.noOfItems2.set(parseInt(savedCartCount));
    }

    this._CartService.getLoogedUserCart().subscribe({
      next: (res) => {
        this.cartData = res;
        console.log('Cart data loaded:', res.items);
        const itemCount = this.getTotalItemCount();
        this._CartService.noOfItems2.set(itemCount);
        this.saveCartToLocalStorage();
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this._ToastrService.error('Error loading cart data', 'Error');
      }
    });
  }

  calculateTotal(): number {
    if (!this.cartData?.items) return 0;
    return this.cartData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartSummaryForOrder(): { items: StoredCartItem[], total: number, itemCount: number } {
    const items = this.getCartFromLocalStorage();
    const total = this.getCartTotalFromLocalStorage();
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    return { items, total, itemCount };
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }
}
