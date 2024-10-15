import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhasesManagementComponent } from './phases-management.component';

describe('PhasesManagementComponent', () => {
  let component: PhasesManagementComponent;
  let fixture: ComponentFixture<PhasesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhasesManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhasesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
