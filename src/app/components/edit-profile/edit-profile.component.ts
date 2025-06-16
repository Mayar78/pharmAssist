import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EditProfileData } from '../../core/interfaces/EditProfileData';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
   isLoading = false;
  profileForm!: FormGroup;

  profileImages = [
    { url: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png', label: 'Male 1' },
    { url: 'https://cdn-icons-png.flaticon.com/512/2922/2922522.png', label: 'Male 2' },
    { url: 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png', label: 'Female 1' },
    { url: 'https://cdn-icons-png.flaticon.com/512/2922/2922566.png', label: 'Female 2' }
  ];
  selectedImage = this.profileImages[0].url;

  constructor(private fb: FormBuilder, private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    const storedName = sessionStorage.getItem('displayName') || '';
    const storedEmail = sessionStorage.getItem('email') || '';
    const storedPhone = sessionStorage.getItem('phoneNumber') || '';
    const storedImage = sessionStorage.getItem('imageUrl');

    if (storedImage) this.selectedImage = storedImage;

    this.profileForm = this.fb.group({
      firstName: [storedName, [Validators.required, Validators.minLength(2)]],
      email: [{ value: storedEmail, disabled: true }],
      phone: [storedPhone, [Validators.required, Validators.minLength(11)]]
    });
  }

  onImageSelect(img: string) {
    this.selectedImage = img;
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading = true;

    const formData: EditProfileData = {
      displayName: this.profileForm.get('firstName')?.value,
      phoneNumber: this.profileForm.get('phone')?.value
    };

    this.profileService.updateProfile(formData).subscribe({
      next: () => {
        sessionStorage.setItem('displayName', formData.displayName);
        sessionStorage.setItem('phoneNumber', formData.phoneNumber);
        sessionStorage.setItem('imageUrl', this.selectedImage); 

        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Profile updated!',
          timer: 1500,
          showConfirmButton: false
        }).then(() => this.router.navigate(['/main/profile']));
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Failed to update profile',
          text: 'Please try again later.'
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/main/profile']);
  }
}