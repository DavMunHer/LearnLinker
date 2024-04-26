import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user';

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


    signup() {
        if (this.user.password === this.passwordConfirmation) {
            //TODO: Hacer el insert con todo el tema de jwt
            console.log(`Está working`);
            console.log(this.user);
        } else {
            this.errorMessage = 'The password confirmation is not the same as the password one!';
        }
    }
}
