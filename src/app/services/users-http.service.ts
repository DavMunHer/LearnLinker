import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { Project } from '../../interfaces/project';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersHttpService {

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`users`);
    }

    getUser(email: string): Observable<User> {
        return this.http.get<User>(`user/${email}`);
    }

    getUserProjects(email: string): Observable<Project[]> {
        return this.http.get<Project[]>(`user/${email}/projects`);
    }

    signUp(user: User): Observable<User> {
        return this.http.post<User>(`user/signup`, user);
    }

    // Esta función devolverá el jwt para posteriormente guardar el token en localstorage
    login(user: any): Observable<string> {
        return this.http.post<string>(`user/login`, user);
    }
}
