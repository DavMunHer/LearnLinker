import { Injectable, Renderer2 } from '@angular/core';
import { UsersHttpService } from './users-http.service';
import { AuthService } from './auth.service';
import { User } from '../../interfaces/user';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor(
        private userHttpService: UsersHttpService,
    ) { }

    private loadedUser(users: any, usernameOrEmail: string): boolean {
        return users.some((user: any) => {
            return user.email === usernameOrEmail || user.username === usernameOrEmail;
        })
    }

    /**
     *
     * @param usernameOrEmail The username or email requested in the form
     * @param users The users array that contains the current loaded users
     * @param sessionUser The information of the user that is currently logged in
     * @param handleError Function that handles the error returning the error message
     * @returns The error message if the user cannot be added to the users array
     */
    async checkAndAddProjectUser(usernameOrEmail: string, users: &any[], sessionUser: User, handleError: Function): Promise<string> {
        let errorMessage = '';

        if (usernameOrEmail !== '') {
            try {
                const user = await this.userHttpService.checkExistingUser(usernameOrEmail).toPromise();

                if (usernameOrEmail !== sessionUser.email && usernameOrEmail !== sessionUser.username) {
                    if (!this.loadedUser(users, usernameOrEmail)) {
                        users.push(user);
                    } else
                        errorMessage = 'The user is already added in the project!';
                } else {
                    errorMessage = 'You are the manager of the project!';
                }
            } catch (error) {
                errorMessage = handleError(error);
            }
        }

        return errorMessage;
    }


    /**
     *
     * @param usernameOrEmail The username or email requested in the form
     * @param users The users array that contains the current loaded users
     * @param sessionUser The information of the user that is currently logged in
     * @param handleError Function that handles the error returning the error message
     * @returns The error message if the user cannot be added to the users array
     */
    async checkAndAddTaskUser(usernameOrEmail: string, users: &any[], sessionUser: User, projectId: string, handleError: Function): Promise<string> {
        let errorMessage = '';

        if (usernameOrEmail !== '') {
            try {
                const user = await this.userHttpService.checkExistingUserWithRole(usernameOrEmail, projectId).toPromise();

                if (usernameOrEmail !== sessionUser.email && usernameOrEmail !== sessionUser.username) {
                    if (user.role) {
                        // Cuando la respuesta devuelva el atributo de rol es porque el usuario ya estaba en el proyecto
                        if (user.role === 'manager') {
                            return 'This user is the manager of the project!';
                        } else if (user.role === 'leader') {
                            return 'This user is a leader of the project!';
                        }
                    }
                        if (!this.loadedUser(users, usernameOrEmail)) {
                            users.push(user);
                        } else
                        errorMessage = 'The user is already added in the task!';
                } else {
                    errorMessage = 'You are the leader of the project!';
                }
            } catch (error) {
                errorMessage = handleError(error);
            }
        }

        return errorMessage;
    }

    addUser(users: & string[], user: any, renderer: Renderer2) {
        users.push(user);
        const emailContainerElement = document.createElement('div');
        emailContainerElement.id = `email-container-${users.length}`;
        emailContainerElement.classList.add('flex', 'mx-2', 'px-0.5', 'border-2', 'rounded-xl');
        emailContainerElement.innerHTML = `
                        <span class="leader-info mr-1 ml-0.5">${user.username}</span>
                        <svg class="hover:bg-gray-400 rounded-xl hover:cursor-pointer" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M16 8L8 16M8.00001 8L16 16" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </g>
                        </svg>
                        `;
        const parentElement = document.querySelector('#leader-container');
        renderer.insertBefore(parentElement, emailContainerElement, document.querySelector('#leader-email-or-username'));
    }

    private parentEmailContainerLogic(parentContainer: any, childContainer: any, leaders: any[]): string[] {
        const emailOrUsername = childContainer.querySelector('.leader-info').textContent;
        parentContainer.removeChild(childContainer);
        return leaders.filter(leaderInfo => {
            return leaderInfo.username != emailOrUsername;
        });
    }

    removeUser(event: any, users: string[]) {
        let parentContainer;
        let emailContainer;
        if (event.target.tagName === 'svg') {
            emailContainer = event.target.parentElement;
            parentContainer = emailContainer.parentElement;
            return this.parentEmailContainerLogic(parentContainer, emailContainer, users);
        } else if (event.target.tagName === 'path') {
            emailContainer = event.target.parentElement.parentElement.parentElement;
            parentContainer = emailContainer.parentElement;
            return this.parentEmailContainerLogic(parentContainer, emailContainer, users);
        } else {
            return users;
        }
    }
}
