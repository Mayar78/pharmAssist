import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css'
})
export class OrdersListComponent implements OnInit {
  orders: any[] = [];
  isLoading = true;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  goToOrder(orderId: number) {
    this.router.navigate(['/main/orderstatus'], { queryParams: { orderId } });
  }
}