import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { enviroments } from '../enviroments/enviroment';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  decodedInfo:any;

  constructor(private _HttpClient:HttpClient) { }

  register(userData:object):Observable<any>{
    return this._HttpClient.post(`${enviroments.baseUrl}/api/Accounts/Register`,userData)}

 loginUser(userData:object):Observable<any>{
    return this._HttpClient.post(`${enviroments.baseUrl}/api/Accounts/Login`, userData)
  }

    saveDecodedInfo():void{
    if(sessionStorage.getItem('token') != null){
        this.decodedInfo = jwtDecode(sessionStorage.getItem('token') !)
    }
    console.log("Decoded Data",this.decodedInfo);

  }

  otp(email:object):Observable<any>{
    return this._HttpClient.post(`${enviroments.baseUrl}/api/Otp/VerifyOtp`, email)

  }
  resendOtp(data: { email: string }): Observable<any> {
  return this._HttpClient.post(`${enviroments.baseUrl}/api/Otp/Resend`, data);
}

forgetPassword(userEmail: object): Observable<any> {
  return this._HttpClient.post(
    `${enviroments.baseUrl}/api/Accounts/ForgotPassword`,
    userEmail
  );
}

resetCode(resetCode: object): Observable<any> {
  console.log('Sending reset code request:', resetCode);
  return this._HttpClient.post(
    `${enviroments.baseUrl}/api/Otp/VerifyResetOtp`,
    resetCode
  ).pipe(
    tap(response => console.log('Reset code response:', response)),
    catchError(error => {
      console.error('Reset code API error:', error);
      return throwError(() => ({
        error: error.error,
        status: error.status,
        message: error.message
      }));
    })
  );
}
newData(userData: object): Observable<any> {
  return this._HttpClient.post(
    `${enviroments.baseUrl}/api/Accounts/ResetPassword`,
    userData
  ).pipe(
    catchError(error => {
      console.error('ResetPassword Error:', error);
      return throwError(() => error);
    })
  );
}
}


