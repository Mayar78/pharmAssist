
import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-code-verfication',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './code-verfication.component.html',
  styleUrl: './code-verfication.component.css'
})
export class CodeVerficationComponent implements AfterViewInit, OnInit {
  otpForm: FormGroup;
  email: string = '';
  resendDisabled: boolean = false;
  resendTimer: number = 60;
  intervalId: any;
  otpSub!: Subscription;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private _AuthService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private _ToastrService: ToastrService,
  ) {
    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      otp2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      otp3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      otp4: ['', [Validators.required, Validators.pattern('[0-9]')]],
      otp5: ['', [Validators.required, Validators.pattern('[0-9]')]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.startResendTimer();
    });
  }

  ngAfterViewInit(): void {
    this.otpInputs.forEach((input, index, inputsArray) => {
      const nativeEl = input.nativeElement;

      nativeEl.addEventListener('input', (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.value.length === 1 && index < inputsArray.length - 1) {
          inputsArray[index + 1].nativeElement.focus();
        }
      });

      nativeEl.addEventListener('keydown', (event: KeyboardEvent) => {
        const target = event.target as HTMLInputElement;
        if (event.key === 'Backspace' && target.value === '' && index > 0) {
          inputsArray[index - 1].nativeElement.focus();
        }
      });
    });
  }

  onSubmit(): void {
    const controls = Object.values(this.otpForm.controls);
    const allFilled = controls.every(control => control.valid && control.value !== '');

    if (!allFilled) {
      this._ToastrService.info('Try Again', 'Please enter all digits of the verification code.');
      return;
    }

    if (this.otpForm.valid) {
      const otpCode =
        this.otpForm.value.otp1 +
        this.otpForm.value.otp2 +
        this.otpForm.value.otp3 +
        this.otpForm.value.otp4 +
        this.otpForm.value.otp5;

      const data = {
        email: this.email,
        code: otpCode
      };

      this.otpSub = this._AuthService.otp(data).subscribe({
        next: (res) => {
          this._ToastrService.success('Successfully', 'OTP verified');
          this.router.navigate(['/auth/questions'], {
            queryParams: { email: this.email }
          });
        },
        error: (err) => {
          this._ToastrService.error('UnSuccessfully', 'OTP verification failed');
        }
      });
    }
  }

  resendOtp(): void {
    if (this.email) {
      this.startResendTimer();

      const data = {
        email: this.email
      };

      this._AuthService.resendOtp(data).subscribe({
        next: (res) => {
          this._ToastrService.success('Done','A verification code has been sent back to your email.')
        },
        error: (err) => {
          this._ToastrService.error(err.message || 'Try again');
        }
      });
    } else {
      this._ToastrService.error("Email doesn't exist");
    }
  }

  startResendTimer(): void {
    this.resendDisabled = true;
    this.resendTimer = 60;

    this.intervalId = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        this.resendDisabled = false;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.otpSub?.unsubscribe();
  }
}