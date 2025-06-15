import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Address } from '../interfaces/Address ';
import { enviroments } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private baseUrl = enviroments.baseUrl;

  constructor(private http: HttpClient) {}

  private addressesSubject = new BehaviorSubject<Address[]>([]);
  addresses$ = this.addressesSubject.asObservable();

  private editingIndex: number | null = null;

  getAddresses(): Address[] {
    return this.addressesSubject.getValue();
  }
 
  setEditingAddressIndex(index: number | null) {
    this.editingIndex = index;
  }
 
  getEditingAddress(): Address | null {
    const addresses = this.getAddresses();
    return this.editingIndex !== null ? addresses[this.editingIndex] : null;
  }
 
addAddress(address: Address): Observable<any> {
  return of(true).pipe(  
    tap(() => {
      const current = this.getAddresses();
      if (this.editingIndex !== null) {
        current[this.editingIndex] = address;
        this.editingIndex = null;
      } else {
        current.push(address);
      }
      this.addressesSubject.next([...current]);
      localStorage.setItem('addresses', JSON.stringify(current));
    })
  );
}
loadSavedAddresses() {
  const saved = localStorage.getItem('addresses');
  if (saved) {
    const parsed: Address[] = JSON.parse(saved);
    this.addressesSubject.next(parsed);
  }
}
}