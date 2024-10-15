import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user';
import { UsersHttpService } from '../services/users-http.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent {
    protected passwordConfirmation: string = '';
    protected errorMessage: string = '';
    protected user: User = {
        username: '',
        email: '',
        password: ''
    }

    constructor(private usersHttpService : UsersHttpService, private router: Router) { }

    checkEmailValidity(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.user.email);
    }

    signup() {
        this.errorMessage = '';
        if (this.user.password === this.passwordConfirmation) {
            this.usersHttpService.signUp(this.user).subscribe({
                next: () => {
                    this.router.navigate(['/login']);
                },
                error: (error) => {
                    this.errorMessage = error.error.message;
                }
            });
        } else {
            this.errorMessage = 'The password confirmation is not the same as the password one!';
        }
    }
}
