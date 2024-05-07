import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { Project } from '../../interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class UsersHttpService {

    constructor(private http: HttpClient) { }

    getUsers() {
        return this.http.get<User[]>(`users`);
    }

    getUserProjects(email: string) {
        return this.http.get<Project[]>(`user/${email}/projects`);
    }

    signUp(user: User) {
        return this.http.post<User>(`user/signup`, user);
    }

    login(user: any) {
        return this.http.post<string>(`user/login`, user);
    }
}
