import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import * as jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor() { }

    isLogued(): boolean {
        return !!localStorage.getItem('Token');
    }

    getToken(): string | null {
        return localStorage.getItem('Token');
    }

    getSessionUser(): User {
        return jwtDecode.jwtDecode(this.getToken()!);
    }

    logout(): void {
        localStorage.removeItem('Token');
    }
}
