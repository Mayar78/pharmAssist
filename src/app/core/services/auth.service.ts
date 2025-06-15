import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { enviroments } from '../enviroments/enviroment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
decodedInfo: any;

  constructor(private _HttpClient: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    const headersConfig: Record<string, string> = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    };

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    return new HttpHeaders(headersConfig);
  }

  register(userData: object): Observable<any> {
    return this._HttpClient.post(
      `${enviroments.baseUrl}/api/Accounts/Register`,
      userData
    );
  }

  loginUser(userData: object): Observable<any> {
    return this._HttpClient.post(
      `${enviroments.baseUrl}/api/Accounts/Login`,
      userData
    );
  }

  saveDecodedInfo(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.decodedInfo = jwtDecode(token);
      console.log(this.decodedInfo);
    }
  }

  otp(data: { email: string; code: string }): Observable<any> {
    return this._HttpClient.post(
      `${enviroments.baseUrl}/api/Otp/VerifyOtp`,
      data
    );
  }

  resendOtp(data: { email: string }): Observable<any> {
    return this._HttpClient.post(
      `${enviroments.baseUrl}/api/Otp/Resend`,
      data
    );
  }

  forgetPassword(userEmail: object): Observable<any> {
    return this._HttpClient.post(
      `${enviroments.baseUrl}/api/Accounts/ForgotPassword`,
      userEmail
    );
  }

  resetCode(resetCode: object): Observable<any> {
    return this._HttpClient.post(
      `${enviroments.baseUrl}/api/Otp/VerifyResetOtp`,
      resetCode
    ).pipe(
      tap((response) => console.log('Reset Code Response:', response)),
      catchError((error) => {
        console.error('Reset code API error:', error);
        return throwError(() => ({
          error: error.error,
          status: error.status,
          message: error.message,
        }));
      })
    );
  }

  newData(userData: object): Observable<any> {
    return this._HttpClient
      .post(`${enviroments.baseUrl}/api/Accounts/ResetPassword`, userData)
      .pipe(
        catchError((error) => {
          console.error('ResetPassword Error:', error);
          return throwError(() => error);
        })
      );
  }

  sendAnswers(answers: any): Observable<any> {
    return this._HttpClient.post(
      `${enviroments.baseUrl}/api/Accounts/UpdateAnswers`,
      answers,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap((res) => console.log('Answers submitted:', res)),
      catchError((err) => {
        console.error('Error sending answers:', err);
        return throwError(() => err);
      })
    );
  }

  loginAfterQuestions(email: string): Observable<any> {
    return this._HttpClient.post(
      `${enviroments.baseUrl}/api/Accounts/LoginAfterQuestions`,
      { email },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap((res: any) => {
        if (res.token) {
          sessionStorage.setItem('token', res.token);
          this.saveDecodedInfo();
        }
      }),
      catchError((err) => {
        console.error('LoginAfterQuestions error:', err);
        return throwError(() => err);
      })
    );
  }
}