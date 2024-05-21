import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedUsersComponent } from './added-users.component';

describe('AddedUsersComponent', () => {
  let component: AddedUsersComponent;
  let fixture: ComponentFixture<AddedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddedUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
