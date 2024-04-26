import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user';
import { UsersHttpService } from '../services/users-http.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    protected user: User = {
        username: '',
        email: '',
        password: ''
    }

    constructor(private usersHttpService: UsersHttpService) {

    }

    login() {
        this.usersHttpService.getUsers().subscribe((response) => {
            let users = response;
            console.log(users);
        });
    }
}
