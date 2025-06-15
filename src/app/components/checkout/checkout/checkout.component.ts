import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AddressService } from '../../../core/services/address.service';
import { Address } from '../../../core/interfaces/Address ';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
   constructor(private location: Location, private router: Router, private route: ActivatedRoute,private addressService: AddressService) {}
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

ngOnInit() {
  this.itemsCount = Number(sessionStorage.getItem('cartItemCount')) || 0;
  this.totalPrice = Number(sessionStorage.getItem('totalPrice')) || 0;

 
  this.addressService.loadSavedAddresses();

  this.addressService.addresses$.subscribe(addresses => {
    this.addresses = addresses;
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
  // this.router.navigate(['/main/']);
  this.router.navigate(['/main/order-success']);
}
}

