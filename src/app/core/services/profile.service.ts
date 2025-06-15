import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroments } from '../enviroments/enviroment';
import { EditProfileData } from '../interfaces/EditProfileData';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = enviroments.baseUrl;

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get<any>(`${this.baseUrl}/api/Accounts/GetProfile`);
  }

  updateProfile(data: EditProfileData) {
    return this.http.put(`${this.baseUrl}/api/Accounts/EditProfile`, data);
  }
}