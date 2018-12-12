import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateScreenComponent } from './state-screen.component';

describe('StateScreenComponent', () => {
  let component: StateScreenComponent;
  let fixture: ComponentFixture<StateScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
