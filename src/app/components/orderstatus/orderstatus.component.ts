import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { CommonModule } from '@angular/common';

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
  selector: 'app-orderstatus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orderstatus.component.html',
  styleUrl: './orderstatus.component.css'
})
export class OrderstatusComponent implements OnInit {
  orders: any[] = [];
  cartData: ICart | null = null;
  shippingPrice: number = 25;
  itemsTotal: number = 0;
  totalItems: number = 0;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadCartDataFromStorage();
  }

  loadOrders(): void {
    this.orderService.getUserOrders().subscribe({
      next: (res) => {
        this.orders = res;
        console.log("Orders: ", res);
      },
      error: (err) => {
        console.error("Error loading orders:", err);
      }
    });
  }

  loadCartDataFromStorage(): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      try {
        this.cartData = JSON.parse(cart);
        this.itemsTotal = this.cartData && this.cartData.items
          ? this.cartData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
          : 0;
        this.totalItems = this.cartData && this.cartData.items
          ? this.cartData.items.reduce((acc, item) => acc + item.quantity, 0)
          : 0;
      } catch (e) {
        console.error("Invalid cart data in sessionStorage", e);
        this.cartData = null;
      }
    }
  }

  getTotal(): number {
    return this.itemsTotal + this.shippingPrice;
  }
}
