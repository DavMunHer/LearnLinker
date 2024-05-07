import { Component, OnInit } from '@angular/core';
import { Project } from '../../interfaces/project';
import { AuthService } from '../services/auth.service';
import { UsersHttpService } from '../services/users-http.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    protected userProjects!: Project[];

    constructor(private authService: AuthService, private userHttpService: UsersHttpService) { }

    ngOnInit(): void {
        const userInfo = this.authService.getSessionUser();
        this.userHttpService.getUserProjects(userInfo.email).subscribe((projects) => {
            this.userProjects = projects;
        });
    }
}
