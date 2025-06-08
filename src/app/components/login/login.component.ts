import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loading: boolean = false;
  responseMssg!: string;
  errorOrSuccess!: String;
  loginSub!: Subscription;
  intervalId!: any;
  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _Router: Router
  ) {}

  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [
      null,
      [
        Validators.required,
        Validators.pattern(
          /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/
        ),
      ],
    ],
  });

  loginUser(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      console.log(this.loginForm);
      this.loginSub = this._AuthService
        .loginUser(this.loginForm.value)
        .subscribe({
          next: (res) => {
            console.log(res);

            sessionStorage.setItem('token', res.token);
            this._AuthService.saveDecodedInfo();
            this.responseMssg = res.message;
            this.errorOrSuccess = 'success';
            this.loading = false;
            this.intervalId = setInterval(() => {
              this._Router.navigate(['/main/home']);
            }, 2000);
          },
          error: (error) => {
            this.errorOrSuccess = 'error';
            this.responseMssg = error.error.message;
            this.loading = false;
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();

    clearInterval(this.intervalId);
  }
}
