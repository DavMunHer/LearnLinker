import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-added-user-mini-card',
    standalone: true,
    imports: [],
    templateUrl: './added-user-mini-card.component.html',
    styleUrl: './added-user-mini-card.component.scss'
})
export class AddedUserMiniCardComponent {
    @Input() user: any;
    @Output() removeUser = new EventEmitter<string>();

    removeUserEvent() {
        this.removeUser.emit(this.user.username);
    }
}
