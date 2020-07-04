import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiBackendComponent } from './multi-backend.component';

describe('MultiBackendComponent', () => {
  let component: MultiBackendComponent;
  let fixture: ComponentFixture<MultiBackendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiBackendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiBackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
