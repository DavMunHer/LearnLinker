import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user';
import { UsersHttpService } from '../services/users-http.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
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

    constructor(private usersHttpService : UsersHttpService) { }

    signup() {
        this.errorMessage = '';
        if (this.user.password === this.passwordConfirmation) {
            this.usersHttpService.signUp(this.user).subscribe();
        } else {
            this.errorMessage = 'The password confirmation is not the same as the password one!';
        }
    }
}
