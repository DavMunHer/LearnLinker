import { Component } from '@angular/core';
import { User } from '../../interfaces/user';
import { AuthService } from '../services/auth.service';


@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent {
    protected loguedUser: User = {
        username: '',
        email: '',
        password: ''
    };

    constructor(protected authService: AuthService) { }

    ngOnInit(): void {
        if (this.authService.isLogued()) {
            this.loguedUser = this.authService.getSessionUser();
            // console.log(this.loguedUser);
        }
    }
}
