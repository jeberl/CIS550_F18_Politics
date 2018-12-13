import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EasylookComponent } from './easylook.component';

describe('EasylookComponent', () => {
  let component: EasylookComponent;
  let fixture: ComponentFixture<EasylookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EasylookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EasylookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
