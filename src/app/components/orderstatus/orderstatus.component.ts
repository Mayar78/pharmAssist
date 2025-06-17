import { Component, OnInit } from '@angular/core';
import { Order, OrderService } from '../../core/services/order.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
//import { Order } from '../../core/interfaces/order';


interface StoredCartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  activeIngredient?: string;
  pictureUrl?: string;
}


@Component({
  selector: 'app-orderstatus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orderstatus.component.html',
  styleUrl: './orderstatus.component.css'
})
export class OrderstatusComponent implements OnInit {

  items: StoredCartItem[] = [];
  total: number = 0;
  itemCount: number = 0;
  //order!: Order;
  isLoading = true;
orders: Order[] = [];
  
  constructor(private route: ActivatedRoute, private OrderService: OrderService) {}
 ngOnInit(): void {
    // first sec:
   this.OrderService.getUserOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.isLoading = false;
      }
    });

     

    const storedItems = localStorage.getItem('cartItems');
    const storedTotal = localStorage.getItem('cartTotal');

    if (storedItems) {
      this.items = JSON.parse(storedItems);
      this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    if (storedTotal) {
      this.total = parseFloat(storedTotal);
    }
  }


  
 getOrderStatusText(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Processing';
      case 2: return 'Shipped';
      case 3: return 'Delivered';
      case 4: return 'Rejected';
      default: return 'Pending';
    }
  }

  getOrderStatusClass(status: number): string {
    switch (status) {
      case 0: return 'badge bg-warning text-dark';
      case 1: return 'badge bg-primary';
      case 2: return 'badge bg-info text-dark';
      case 3: return 'badge bg-success';
      case 4: return 'badge bg-danger';
      default: return 'badge bg-warning text-dark';
    }
  }
}