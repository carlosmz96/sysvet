import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaServicioComponent } from './alta-servicio.component';

describe('AltaServicioComponent', () => {
  let component: AltaServicioComponent;
  let fixture: ComponentFixture<AltaServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaServicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
