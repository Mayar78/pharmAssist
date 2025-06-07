// reset-password.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NavigationEnd,Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  loading: boolean = false;
  resText: string = '';
  resetPasswordSub!: Subscription;

  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _Router: Router
  ) {this._Router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      console.log('Navigation ended to:', event.url);
      if (event.url === '/auth/reset-code') {
        console.warn('Unexpected navigation back to reset-code');
        // منع إعادة التوجيه غير المرغوب فيها
        this._Router.navigate(['/auth/reset-password'], {replaceUrl: true});
      }
    }
  });}

  ngOnInit(): void {
    console.log('ResetPasswordComponent initialized');
    console.log('Stored email:', sessionStorage.getItem('resetEmail'));
    console.log('Stored token:', sessionStorage.getItem('resetToken'));

    if (!sessionStorage.getItem('resetEmail') || !sessionStorage.getItem('resetToken')) {
      console.error('Missing required data in sessionStorage');
      this.resText = 'Session expired. Please start the reset process again.';
      this._Router.navigate(['/auth/reset-code']).then(navSuccess => {
        console.log('Navigation to reset-code:', navSuccess);
      }).catch(navError => {
        console.error('Navigation failed:', navError);
      });
    }
  }

  resetPasswordForm: FormGroup = this._FormBuilder.group({
    newPassword: [null, [Validators.required, Validators.minLength(6)]],
    confirmPassword: [null, [Validators.required]],
  }, { validators: [this.passwordsMatchValidator] });

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  resetPassword(): void {
    console.log('Reset password form submitted', this.resetPasswordForm.value);

    if (this.resetPasswordForm.valid) {
      const email = sessionStorage.getItem('resetEmail');
      const resetToken = sessionStorage.getItem('resetToken');

      console.log('Using email:', email);
      console.log('Using token:', resetToken);

      if (!email || !resetToken) {
        console.error('Missing email or token');
        this.resText = 'Session expired. Please start the reset process again.';
        this._Router.navigate(['/auth/reset-code']);
        return;
      }

      this.loading = true;
      this.resText = '';

      const body = {
        email: email,
        password: this.resetPasswordForm.value.newPassword,
        confirmPassword: this.resetPasswordForm.value.confirmPassword,
        resetToken: resetToken
      };

      console.log('Sending reset request:', body);

      this.resetPasswordSub = this._AuthService.newData(body).subscribe({
        next: (response) => {
          console.log('Reset password success:', response);
          this.loading = false;
          this.resText = 'Password reset successfully! Redirecting to login...';
          
          sessionStorage.removeItem('resetEmail');
          sessionStorage.removeItem('resetToken');
          
          setTimeout(() => {
            this._Router.navigate(['/auth/login']).then(navSuccess => {
              console.log('Navigation to login:', navSuccess);
            });
          }, 2000);
        },
        error: (err) => {
          console.error('Reset password error:', err);
          this.loading = false;
          this.resText = err.error?.message || 'Failed to reset password. Please try again.';
        }
      });
    } else {
      console.log('Form is invalid');
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    if (this.resetPasswordSub) {
      this.resetPasswordSub.unsubscribe();
      console.log('Subscription unsubscribed');
    }
  }
}