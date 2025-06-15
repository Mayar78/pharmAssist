import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../../core/services/address.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Address } from '../../../core/interfaces/Address ';

@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule ],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css'
})
export class AddAddressComponent implements OnInit {
   addressForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private addressService: AddressService, private route: ActivatedRoute) {}

ngOnInit(): void {
  const existing = this.addressService.getEditingAddress();

  this.addressForm = this.fb.group({
    fullName: [existing?.fullName || '', Validators.required],
    phoneNumber: [existing?.phoneNumber || '', [Validators.required, Validators.pattern(/^\d{10,}$/)]],
    email: [existing?.email || '', [Validators.required, Validators.email]],
    addressTitle: [existing?.addressTitle || ''],
    addressLine1: [existing?.street || '', Validators.required],
    addressLine2: [existing?.street2 || ''],
    city: [existing?.city || '', Validators.required],
    country: [existing?.country || '', Validators.required]
  });
}
onSubmit() {
  if (this.addressForm.valid) {
    const formValue = this.addressForm.value;
    const address: Address = {
      fullName: formValue.fullName,
      phoneNumber: formValue.phoneNumber,
      email: formValue.email,
      addressTitle: formValue.addressTitle,
      street: formValue.addressLine1,
      street2: formValue.addressLine2,
      city: formValue.city,
      country: formValue.country
    };

    this.addressService.addAddress(address).subscribe(() => {
      this.router.navigate(['/main/checkout']); 
    });
  } else {
    this.addressForm.markAllAsTouched();
  }
}


cancel() {
  this.addressForm.reset();
  this.router.navigate(['/main/checkout']);
}


  goToCheckout() {
 this.router.navigate(['/main/checkout']);

}

}
// 
