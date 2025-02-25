import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatttyComponent } from './chattty.component';

describe('ChatttyComponent', () => {
  let component: ChatttyComponent;
  let fixture: ComponentFixture<ChatttyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatttyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatttyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
