import { Component, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersHttpService } from '../services/users-http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, NgClass],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    protected user: any = {
        usernameOrEmail: '',
        password: ''
    }
    protected errorMessage: string = '';

    constructor(private usersHttpService: UsersHttpService, private router: Router) { }

    private handleError(error: HttpErrorResponse): void {
        if (error.status === 401) {
            this.errorMessage = 'Invalid credentials';
        } else {
            this.errorMessage = error.error.message;
        }
    }

    login() {
        this.errorMessage = '';
        this.usersHttpService.login(this.user).subscribe({
            next: (token) => {
                localStorage.setItem('Token', token);
            },
            error: (error) => {
                this.handleError(error);
            },
            complete: () => {
                this.router.navigate(['/home']);
            }
        });
    }
}
