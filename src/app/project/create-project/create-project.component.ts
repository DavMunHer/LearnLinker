import { Component, OnInit, Renderer2 } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { FormsModule } from '@angular/forms';
import { ProjectsHttpService } from '../../services/projects-http.service';
import { AuthService } from '../../services/auth.service';
import { UsersHttpService } from '../../services/users-http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { response } from 'express';

@Component({
    selector: 'app-create-project',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './create-project.component.html',
    styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent implements OnInit {
    protected newProject: Project = {
        name: '',
        start_date: '',
        end_date: '',
    }
    protected userEmail = '';
    protected leaderEmailOrUsername = '';
    private leaders: string[] = [];

    protected leaderEmailErrorMessage = '';
    protected errorMessage = '';
    protected successMessage = '';

    constructor(
        private projectHttpService: ProjectsHttpService,
        private authService: AuthService,
        private userHttpService: UsersHttpService,
        private renderer: Renderer2
    ) { }

    private handleError(error: HttpErrorResponse) {
        if (error.status == 404) {
            this.leaderEmailErrorMessage = 'There is no user with that email or username';
        } else if (error.status == 409) {
            this.leaderEmailErrorMessage = 'You can\'t be the leader and the manager at the same time!';
        }
        else {
            this.errorMessage = 'An error has occurred';
        }
    }

    ngOnInit(): void {
        this.userEmail = this.authService.getSessionUser().email;
    }

    sendProject() {
        this.leaderEmailErrorMessage = '';
        this.errorMessage = '';
        this.successMessage = '';

        this.projectHttpService.createProject({
            name: this.newProject.name,
            start_date: this.newProject.start_date,
            end_date: this.newProject.end_date,
            user_email: this.userEmail,
            leaders: this.leaders
        }).subscribe({
            error: (error) => {
                this.handleError(error);
            },
            complete: () => {
                this.successMessage = 'Projected created successfully!';
            }
        });
        // this.userHttpService.getUser(this.leaderEmail).subscribe({
        //     next: (response) => {
        //         if (this.leaderEmail == response.email && this.leaderEmail != this.newProject.user_email) {
        //             this.projectHttpService.createProject({
        //                 name: this.newProject.name,
        //                 start_date: this.newProject.start_date,
        //                 end_date: this.newProject.end_date,
        //                 user_email: this.userEmail,
        //                 leader_email: this.leaderEmail
        //             }).subscribe();
        //         }
        //     },
        //     error: (error) => {
        //         this.handleError(error);
        //     }
        // })
    }

    checkUser() {
        this.leaderEmailErrorMessage = '';
        if (this.leaderEmailOrUsername != '') {
            this.userHttpService.checkExistingUser(this.leaderEmailOrUsername).subscribe({
                next: (userExists) => {
                    if (userExists && this.leaderEmailOrUsername != this.userEmail) {
                        if (!this.leaders.includes(this.leaderEmailOrUsername)) {
                            this.leaders.push(this.leaderEmailOrUsername);
                            const emailContainerElement = document.createElement('div');
                            emailContainerElement.id = `email-container-${this.leaders.length}`;
                            emailContainerElement.classList.add('flex', 'mx-2', 'px-0.5', 'border-2', 'rounded-xl');
                            emailContainerElement.innerHTML = `
                        <span class="leader-info mr-1 ml-0.5">${this.leaderEmailOrUsername}</span>
                        <svg class="hover:bg-gray-400 rounded-xl" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M16 8L8 16M8.00001 8L16 16" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </g>
                        </svg>
                        `;
                            const parentElement = document.querySelector('#leader-container');
                            this.renderer.insertBefore(parentElement, emailContainerElement, document.querySelector('#leader-email-or-username'));
                            this.leaderEmailOrUsername = '';
                        } else
                            this.leaderEmailErrorMessage = 'The user is already added as leader!';
                    }
                },
                error: (error) => {
                    this.handleError(error);
                }
            });
        }

    }

    removeEmail(event: any) {
        let parentContainer;
        let emailContainer;
        if (event.target.tagName === 'svg') {
            emailContainer = event.target.parentElement;
            parentContainer = emailContainer.parentElement;
            this.leaders = this.parentEmailContainerLogic(parentContainer, emailContainer, this.leaders);
        } else if (event.target.tagName === 'path') {
            emailContainer = event.target.parentElement.parentElement.parentElement;
            parentContainer = emailContainer.parentElement;
            this.leaders = this.parentEmailContainerLogic(parentContainer, emailContainer, this.leaders);
        }
        console.log(this.leaders);
    }

    private parentEmailContainerLogic(parentContainer: any, childContainer: any, leaders: string[]): string[] {
        const emailOrUsername = childContainer.querySelector('.leader-info').textContent;
        console.log(emailOrUsername);
        parentContainer.removeChild(childContainer);
        return leaders.filter(leaderInfo => {
            return leaderInfo != emailOrUsername;
        });
    }

}
