import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userName: string = '';
  userEmail: string = '';
userPhone: string = '';

 constructor(private router: Router) {}

 ngOnInit(): void {
    
    this.userName = sessionStorage.getItem('displayName') || 'User';
    this.userEmail = sessionStorage.getItem('email') || 'example@mail.com';
    this.userPhone = sessionStorage.getItem('phoneNumber') || '';

  }

  navigateTo(path: string): void {
    this.router.navigate([`/main/${path}`]);
  }
  
}