import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor() { }

    isLogued(): boolean {
        return !!localStorage.getItem('Token');
    }

    logout(): void {
        localStorage.removeItem('Token');
    }
}
