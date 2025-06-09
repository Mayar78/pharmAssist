import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @ViewChild('layer') questionLayer!: ElementRef<HTMLDivElement>;
  loading: boolean = false;
  responseMssg!: string;
  errorOrSuccess!: String;
  loginSub!: Subscription;
  submitted: boolean = false;
  intervalId!: any;
  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _Router: Router
  ) {}
  questions: string[] = [
    'What prompted you to seek medical support at this time?',
    'Do you have any chronic or recurring health conditions?',
    'How have these conditions been affecting your daily life or routines?',
    'Are you experiencing any specific symptoms or concerns right now?',
  ];
  answers: string[] = ['', '', ''];
  currentIndex = 0;
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
            this.questionLayer.nativeElement.classList.remove('d-none');
            this.questionLayer.nativeElement.classList.add('d-flex');
            sessionStorage.setItem('token', res.token);
            this._AuthService.saveDecodedInfo();
            this.responseMssg = res.message;
            this.errorOrSuccess = 'success';
            this.loading = false;
            // this.intervalId = setInterval(() => {
            //   this._Router.navigate(['/main/home']);
            // }, 2000);
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
  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
  submit() {
    this.sendQuestionAnswers();
    // this._Router.navigate(['/main/home']);
  }
  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();

    clearInterval(this.intervalId);
  }
  sendQuestionAnswers(): void {
    const jsonToApi = {
      PromptReason: this.answers[0],
      HasChronicConditions: this.answers[1],
      TakesMedicationsOrTreatments: this.answers[2],
      CurrentSymptoms: this.answers[3],
    };
    this._AuthService.sendAnswers(jsonToApi).subscribe({
      next: (res) => {
        if (res.success == true) {
          this._Router.navigate(['/main/home']);
        }
      },
      error: (err) => {
        console.error('Error sending answers:', err);
      },
    });
  }
}
