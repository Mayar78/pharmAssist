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

  clearAllCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this._NgxSpinnerService.show();
      this._CartService.clearCart().subscribe({
        next: (res) => {
          this._NgxSpinnerService.hide();
          this.cartData = res;
          this._CartService.noOfItems2.set(0);
          this._ToastrService.success('Cart cleared successfully', 'Success');
        },
        error: (err) => {
          this._NgxSpinnerService.hide();
          this._ToastrService.error(err.error?.message || 'Error clearing cart', 'Error');
        }
      });
    }
  }

  deleteItem(p_id: number): void {
    this._NgxSpinnerService.show();
    this._CartService.removeItemFormCart(p_id).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this.cartData = res;
        this._ToastrService.success(res.message, "Deleted Successfully");
        // Update cart count
        const itemCount = this.cartData?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
        this._CartService.noOfItems2.set(itemCount);
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
        this._ToastrService.error(err.error?.message, "Error");
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
      // لا حاجة لإظهار رسالة لكل تغيير في الكمية
      // Update cart count
      const itemCount = this.cartData?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
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
    
    this._CartService.getLoogedUserCart().subscribe({
      next: (res) => {
        this.cartData = res;
        console.log("Cart data loaded:", res.items);
        // Update cart count on load
        const itemCount = this.cartData?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
        this._CartService.noOfItems2.set(itemCount);
      },
      error: (err) => {
        console.error("Error loading cart:", err);
        this._ToastrService.error('Error loading cart data', 'Error');
      }
    });
  }

  calculateTotal(): number {
    if (!this.cartData?.items) return 0;
    return this.cartData.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }
}