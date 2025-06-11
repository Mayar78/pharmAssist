import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class NotFoundComponent {
  
  constructor(
    private router: Router,
    private location: Location
  ) {}

  /**
   * Navigate back to the previous page or home if no history
   */
  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
   * Navigate to home page
   */
  goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Navigate to products/medications page
   */
  goToProducts(): void {
    this.router.navigate(['/main/AllProducts']);
  }

 
}