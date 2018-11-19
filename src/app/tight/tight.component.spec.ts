import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TightComponent } from './tight.component';

describe('TightComponent', () => {
  let component: TightComponent;
  let fixture: ComponentFixture<TightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
