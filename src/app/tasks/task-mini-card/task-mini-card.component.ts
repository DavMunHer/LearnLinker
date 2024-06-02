import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Task } from '../../../interfaces/task';

@Component({
  selector: 'app-task-mini-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './task-mini-card.component.html',
  styleUrl: './task-mini-card.component.scss'
})
export class TaskMiniCardComponent {
    @Input() task!: Task;
}
