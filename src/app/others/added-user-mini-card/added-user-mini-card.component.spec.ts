import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedUserMiniCardComponent } from './added-user-mini-card.component';

describe('AddedUserMiniCardComponent', () => {
  let component: AddedUserMiniCardComponent;
  let fixture: ComponentFixture<AddedUserMiniCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddedUserMiniCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddedUserMiniCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
