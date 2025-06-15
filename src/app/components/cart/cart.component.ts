import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartService } from '../../services/cart.service';
import { ICart, ICartItem } from '../../interfaces/icart';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

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
  totalPrice!:number

  // Get total item count
  getTotalItemCount(): number {
    if (!this.cartData?.items) return 0;
    const totalCount = this.cartData.items.reduce((total, item) => total + item.quantity, 0);
    
    // Save to session storage
    sessionStorage.setItem('cartItemCount', totalCount.toString());
    
    return totalCount;
  }

  // Show clear cart modal
  showClearCartModal(): void {
    this.showModal = true;
  }

  // Hide clear cart modal
  hideClearCartModal(): void {
    this.showModal = false;
  }

  // Hide modal when clicking on backdrop
  hideModalOnBackdrop(event: Event): void {
    if (event.target === event.currentTarget) {
      this.hideClearCartModal();
    }
  }

  // Confirm clear cart
  confirmClearCart(): void {
    this._NgxSpinnerService.show();
    this._CartService.clearCart().subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this.cartData = res;
        this._CartService.noOfItems2.set(0);
        
        // Update session storage
        sessionStorage.setItem('cartItemCount', '0');
        
        this._ToastrService.success('تم مسح السلة بنجاح', 'نجح العملية');
        this.hideClearCartModal();
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
        this._ToastrService.error(err.error?.message || 'خطأ في مسح السلة', 'خطأ');
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
        this._ToastrService.success(res.message, "تم الحذف بنجاح");
        
        // Update cart count and session storage
        const itemCount = this.getTotalItemCount();
        this._CartService.noOfItems2.set(itemCount);
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
        this._ToastrService.error(err.error?.message, "خطأ");
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
        
        // Update cart count and session storage
        const itemCount = this.getTotalItemCount();
        this._CartService.noOfItems2.set(itemCount);
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
        console.error('Error updating quantity:', err);
        this._ToastrService.error('حدث خطأ أثناء تحديث الكمية', 'خطأ');
      }
    });
  }

  ngOnInit(): void {
    console.log(sessionStorage.getItem('token'));
    
    // Load saved cart count from session storage
    const savedCartCount = sessionStorage.getItem('cartItemCount');
    if (savedCartCount) {
      this._CartService.noOfItems2.set(parseInt(savedCartCount));
    }
    
    this._CartService.getLoogedUserCart().subscribe({
      next: (res) => {
        this.cartData = res;
        console.log("Cart data loaded:", res.items);
        
        // Update cart count and session storage
        const itemCount = this.getTotalItemCount();
        this._CartService.noOfItems2.set(itemCount);
      },
      error: (err) => {
        console.error("Error loading cart:", err);
        this._ToastrService.error('خطأ في تحميل بيانات السلة', 'خطأ');
      }
    });
  }

  calculateTotal(): number {
    if (!this.cartData?.items) return 0;
    return this.cartData.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
      // sessionStorage.setItem("totalPrice", )
    }, 0);
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }
}