import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AddressService } from '../../../core/services/address.service';
import { Address } from '../../../core/interfaces/Address ';
import { OrderService } from '../../../core/services/order.service';
import { CartService } from '../../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
 http: any;
  baseUrl: any;
   constructor(private location: Location, private router: Router, private route: ActivatedRoute,private addressService: AddressService, private cartService: CartService, private orderService: OrderService) {}
 paymentMethod: string = 'cod';
  itemsCount: number = 0;
  totalPrice: number = 0;
 addresses: Address[] = [];

 // addresses: any[] = [];
  selectedAddressIndex: number | null = null;

  isAdding: boolean = false;
  isEditingIndex: number | null = null;

 newAddress: Address = {
  fullName: '',
  phoneNumber: '',
  email: '',
  street: '',
  city: '',
  country: '',

  addressTitle: '',
  street2: ''
};

cartData: any; 
deliveryMethods: any[] = [];
selectedDeliveryMethodId: number | null = null;

ngOnInit() {
  this.itemsCount = Number(sessionStorage.getItem('cartItemCount')) || 0;
  this.totalPrice = Number(localStorage.getItem('cartTotal')) || 0;



  this.addressService.loadSavedAddresses();

  this.addressService.addresses$.subscribe(addresses => {
    this.addresses = addresses;
  });

   
  this.cartService.getLoogedUserCart().subscribe(cart => {
    this.cartData = cart;
    if (cart?.id) {
      localStorage.setItem('basket_id', cart.id);  
    }
    
  });

  
  this.orderService.getDeliveryMethods().subscribe(methods => {
    this.deliveryMethods = methods;
    if (methods.length > 0) {
      this.selectedDeliveryMethodId = methods[0].id; 
    }
  });
}


goBack() {
  //this.location.back();
  this.router.navigate(['/main/cart']);
}
navigateToAddAddress() {
  this.addressService.setEditingAddressIndex(null);
  this.router.navigate(['/main/add-address'], { queryParams: { returnTo: 'checkout' } });
}

 addOrUpdateAddress() {
  if (this.isEditingIndex !== null) {
    this.addresses[this.isEditingIndex] = { ...this.newAddress };
  } else {
    this.addresses.push({ ...this.newAddress });
  }

  this.cancelForm();
}


editAddress(index: number) {
  this.addressService.setEditingAddressIndex(index);
  this.router.navigate(['/main/add-address'], { queryParams: { returnTo: 'checkout' } });
}


  cancelForm() {
    this.isAdding = false;
    this.isEditingIndex = null;
   this.newAddress = {
  fullName: '',
  phoneNumber: '',
  email: '',
  addressTitle: '',
  street: '',
  street2: '',
   city: '',
  country: ''
};

  }

  onPayNow() {
  if (this.selectedAddressIndex === null || this.addresses.length === 0) {
    return;
  }

  const selectedAddress = this.addresses[this.selectedAddressIndex];
  const fullName = selectedAddress.fullName?.trim() || '';
  const firstName = fullName.split(' ')[0] || 'default_first_name';
  const lastName = fullName.split(' ').slice(1).join(' ') || 'default_last_name';

  const basketId = localStorage.getItem('basket_id') || '';
  const deliveryMethodId = this.selectedDeliveryMethodId;
  const orderData = {
    basketId: basketId,
    deliveryMethodId: deliveryMethodId,
    shippingAddress: {
      firstName: firstName,
      lastName: lastName,
      street: selectedAddress.street,
      city: selectedAddress.city,
      country: selectedAddress.country
    }
  };
  console.log('orderData:', orderData);
  console.log('basketId:', basketId);  
  console.log('shippingAddress:', orderData.shippingAddress);
  console.log('deliveryMethodId:', orderData.deliveryMethodId);
  this.orderService.createOrder(orderData).subscribe({
    next: (order) => {
      
      this.cartService.clearCart().subscribe({
        next: () => {
          localStorage.removeItem('cartItems');
          localStorage.removeItem('cartTotal');
          sessionStorage.setItem('cartItemCount', '0');
          
          this.router.navigate(['/main/order-success'], { queryParams: { orderId: order.id } });
        },
        error: () => {
          localStorage.removeItem('cartItems');
          localStorage.removeItem('cartTotal');
          sessionStorage.setItem('cartItemCount', '0');
          this.router.navigate(['/main/order-success'], { queryParams: { orderId: order.id } });
        }
      });
    },
    error: (err) => {
      console.error('Order creation error:', err);
      alert('Error: ' + (err?.error?.message || JSON.stringify(err?.error) || err.message));
    }
  });
}
createOrder(orderData: any): Observable<any> {
  const token = sessionStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  return this.http.post(`${this.baseUrl}/api/orders`, orderData, { headers });
}
}

export class OrderSuccessComponent {
  orderId: number | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] ? +params['orderId'] : null;
    });
  }

  goBack() {
    this.router.navigate(['/main/checkout']);
  }

  goToAllProducts(): void {
    this.router.navigate(['/main/AllProducts']);
  }

  goToOrderStatus(): void {
    if (this.orderId) {
      this.router.navigate(['/main/order-status'], { queryParams: { orderId: this.orderId } });
    } else {
      this.router.navigate(['/main/order-status']);
    }
  }
}