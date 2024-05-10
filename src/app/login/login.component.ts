import { Component, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersHttpService } from '../services/users-http.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    protected user: any = {
        usernameOrEmail: '',
        password: ''
    }
    protected errorMessage: string = '';

    constructor(private usersHttpService: UsersHttpService, private httpError: ErrorHandler) { }

    private handleError(error: HttpErrorResponse): void {
        if (error.status === 401) {
            this.errorMessage = 'Invalid credentials';
        } else {
            this.errorMessage = 'Ha ocurrido un error';
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
            }
        });
    }
}
