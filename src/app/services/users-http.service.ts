import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersHttpService {

    constructor(private http: HttpClient) { }

    getUsers() {
        return this.http.get<User[]>(`users`);
    }

    signUp(user: User) {
        return this.http.post<User>(`user/signup`, user);
    }

    login(user: any) {
        return this.http.post<string>(`user/login`, user);
    }
}