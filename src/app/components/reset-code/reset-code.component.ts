// reset-code.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NavigationStart, Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-reset-code',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './reset-code.component.html',
  styleUrl: './reset-code.component.css'
})
export class ResetCodeComponent implements OnInit {
  errorMsg: string = '';
  loading: boolean = false;
  resetCodeSub!: Subscription;

  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _Router: Router
  ) {
    this._Router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Navigation started to:', event.url);
      }
    });
  }


  ngOnInit(): void {
    console.log('ResetCodeComponent initialized');
    console.log('Stored email:', sessionStorage.getItem('resetEmail'));

    if (!sessionStorage.getItem('resetEmail')) {
      console.error('No email found in sessionStorage');
      this.errorMsg = 'Session expired. Please restart password reset process.';
      // يمكنك توجيه المستخدم لصفحة إعادة تعيين البريد الإلكتروني هنا
    }
  }

  resetCodeForm: FormGroup = this._FormBuilder.group({
    otp: [null, [Validators.required, Validators.pattern(/^\d{5}$/)]],
  });

  resetCode(): void {
    console.log('Form submitted', this.resetCodeForm.value);

    if (this.resetCodeForm.valid) {
      const email = sessionStorage.getItem('resetEmail');
      console.log('Retrieved email:', email);

      if (!email) {
        this.errorMsg = 'Email not found. Please restart the reset process.';
        console.error('Email not found in sessionStorage');
        return;
      }

      this.loading = true;
      this.errorMsg = '';

      const body = {
        "email": email,
        "code": this.resetCodeForm.value.otp
      };

      console.log('Sending request body:', body);

      this.resetCodeSub = this._AuthService
        .resetCode(body)
        .subscribe({
          next: (res) => {
            console.log('API Response:', res);
            this.loading = false;

            if (res?.resetToken) {
              console.log('Received resetToken:', res.resetToken);
              sessionStorage.setItem('resetToken', res.resetToken);

             
              this._Router.navigate(['/auth/reset-password'], {
                replaceUrl: true
              }).then(() => {
                console.log('Navigation completed successfully');
                window.location.href = '/auth/reset-password';
              }).catch(err => {
                console.error('Navigation failed:', err);
              });
            } else {
              this.errorMsg = 'Invalid response from server - no token received';
              console.error('No resetToken in response:', res);
            }
          },
          error: (err) => {
            console.error('API Error:', err);
            this.loading = false;
            this.errorMsg = err.error?.message || 'Failed to verify code. Please try again.';
          },
        });
    } else {
      console.log('Form is invalid');
      this.resetCodeForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    if (this.resetCodeSub) {
      this.resetCodeSub.unsubscribe();
      console.log('Subscription unsubscribed');
    }
  }
}