import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroments } from '../enviroments/enviroment';
import { AnswerData } from './Answer';
 



@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

    
// private getAuthHeaders(): HttpHeaders {
//  // const token = sessionStorage.getItem('token')!;
//   return new HttpHeaders({
//      "ngrok-skip-browser-warning": "true"
//   });
// }

 private apiUrl = enviroments.baseUrl;

  constructor(private http: HttpClient) {}

   
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    const headersConfig: Record<string, string> = {
       Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "true",
    };

    // const token = sessionStorage.getItem('token');
    // if (token) {
    //   headersConfig['Authorization'] = `Bearer ${token}`;
    // }

    return new HttpHeaders(headersConfig);
  }

 
  submitAnswers(answers: AnswerData): Observable<AnswerData> {
    return this.http.post<AnswerData>(
      `${this.apiUrl}/api/Accounts/UpdateAnswers`,
      answers,
      { headers: this.getAuthHeaders() }
    );
  }

   
  getAnswers(): Observable<AnswerData> {
    return this.http.get<AnswerData>(
      `${this.apiUrl}/api/Accounts/GetAnswers`,
      { headers: this.getAuthHeaders() }
    );
  }
}