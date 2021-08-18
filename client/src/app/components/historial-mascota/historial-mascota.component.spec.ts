import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialMascotaComponent } from './historial-mascota.component';

describe('HistorialMascotaComponent', () => {
  let component: HistorialMascotaComponent;
  let fixture: ComponentFixture<HistorialMascotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialMascotaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialMascotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
