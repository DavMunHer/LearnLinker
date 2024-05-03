import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    protected loguedUser: User = {
        username: '',
        email: '',
        password: ''
    };

    constructor(protected authService: AuthService) { }

    // ngOnInit(): void {
    //     if (this.authService.isLogued()) {
    //         this.loguedUser = jwtDecode.jwtDecode(JSON.stringify(this.authService.getToken()));
    //         console.log(this.loguedUser);
    //     }
    // }
}
