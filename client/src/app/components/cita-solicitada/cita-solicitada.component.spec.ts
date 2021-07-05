import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaSolicitadaComponent } from './cita-solicitada.component';

describe('CitaSolicitadaComponent', () => {
  let component: CitaSolicitadaComponent;
  let fixture: ComponentFixture<CitaSolicitadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitaSolicitadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitaSolicitadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
