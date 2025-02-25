import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollLandingComponent } from './poll-landing.component';

describe('PollLandingComponent', () => {
  let component: PollLandingComponent;
  let fixture: ComponentFixture<PollLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
