import { Injectable, Renderer2 } from '@angular/core';
import { UsersHttpService } from './users-http.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor(
        private userHttpService: UsersHttpService,
        private authService: AuthService
    ) { }

    addUser(users: &string[], leaderEmailOrUsername: string, renderer: Renderer2) {
        users.push(leaderEmailOrUsername);
        const emailContainerElement = document.createElement('div');
        emailContainerElement.id = `email-container-${users.length}`;
        emailContainerElement.classList.add('flex', 'mx-2', 'px-0.5', 'border-2', 'rounded-xl');
        emailContainerElement.innerHTML = `
                        <span class="leader-info mr-1 ml-0.5">${leaderEmailOrUsername}</span>
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

    private parentEmailContainerLogic(parentContainer: any, childContainer: any, leaders: string[]): string[] {
        const emailOrUsername = childContainer.querySelector('.leader-info').textContent;
        parentContainer.removeChild(childContainer);
        return leaders.filter(leaderInfo => {
            return leaderInfo != emailOrUsername;
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
