import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent {
    constructor(private router: Router) {}
 goBack() {
    this.router.navigate(['/main/checkout']);
  }
  goToAllProducts(): void {
  this.router.navigate(['/main/AllProducts']);
}
 goToOrderStatus(): void {
    this.router.navigate(['/main/orderstatus']);
  }
}
