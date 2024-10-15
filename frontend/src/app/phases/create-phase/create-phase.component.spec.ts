import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePhaseComponent } from './create-phase.component';

describe('CreatePhaseComponent', () => {
  let component: CreatePhaseComponent;
  let fixture: ComponentFixture<CreatePhaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePhaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatePhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
