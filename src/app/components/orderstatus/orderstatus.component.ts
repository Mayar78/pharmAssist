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

  order: any = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const orderId = Number(params['orderId']);
      if (orderId) {
        this.isLoading = true;
        this.orderService.getOrderById(orderId).subscribe({
          next: (order) => {
            this.order = order;
            this.isLoading = false;
            console.log('Order loaded successfully', this.order);
            
          },
          error: (err) => {
            console.error('Error loading order', err);
            this.isLoading = false;
            this.order = null;
          }
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  getOrderStatusText(status: number | string): string {
    switch (status) {
      case 0: case 'Pending': return 'Pending';
      case 1: case 'Processing': return 'Processing';
      case 2: case 'Shipped': return 'Shipped';
      case 3: case 'Delivered': return 'Delivered';
      case 4: case 'Rejected': return 'Rejected';
      default: return 'Pending';
    }
  }

  getOrderStatusClass(status: number | string): string {
    switch (status) {
      case 0: case 'Pending': return 'badge bg-warning text-dark';
      case 1: case 'Processing': return 'badge bg-primary';
      case 2: case 'Shipped': return 'badge bg-info text-dark';
      case 3: case 'Delivered': return 'badge bg-success';
      case 4: case 'Rejected': return 'badge bg-danger';
      default: return 'badge bg-warning text-dark';
    }
  }
}