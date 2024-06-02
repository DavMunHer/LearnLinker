import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMiniCardComponent } from './task-mini-card.component';

describe('TaskMiniCardComponent', () => {
  let component: TaskMiniCardComponent;
  let fixture: ComponentFixture<TaskMiniCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskMiniCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskMiniCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
