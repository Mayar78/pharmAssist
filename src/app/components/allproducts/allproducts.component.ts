import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router'; // هنا الخطأ: استخدمي RouterModule بدل RouterLink

import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../core/services/products.service';
import { Subscription } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { Iproduct } from '../../core/interfaces/iproduct';

@Component({
  selector: 'app-allproducts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,        // هذا يحل مشكلة ngModel
    RouterLink,       // هذا يحل مشكلة [routerLink]
    CurrencyPipe,
    SearchPipe
  ],
  templateUrl: './allproducts.component.html',
  styleUrl: './allproducts.component.css'
})
export class AllproductsComponent {
  constructor(private _ProductService: ProductsService) {}

  productsData!: Iproduct[];
  Searchvalue: string = '';
  productSub!: Subscription;
  hasMatchingProducts: boolean = false;

  ngOnInit(): void {
    this._ProductService.getAllProduct().subscribe({
      next: (res) => {
        console.log(res.data);
        this.productsData = res.data;
      },
      error: (error) => console.log(error)
    });
  }

  ngOnDestroy(): void {
    this.productSub?.unsubscribe();
  }
}
