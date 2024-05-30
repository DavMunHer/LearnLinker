import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseColComponent } from './phase-col.component';

describe('PhaseColComponent', () => {
  let component: PhaseColComponent;
  let fixture: ComponentFixture<PhaseColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhaseColComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhaseColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
