import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZipcodeDataComponent } from './zipcode-data.component';

describe('ZipcodeDataComponent', () => {
  let component: ZipcodeDataComponent;
  let fixture: ComponentFixture<ZipcodeDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZipcodeDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZipcodeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
