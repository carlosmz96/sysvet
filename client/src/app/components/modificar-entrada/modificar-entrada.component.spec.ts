import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarEntradaComponent } from './modificar-entrada.component';

describe('ModificarEntradaComponent', () => {
  let component: ModificarEntradaComponent;
  let fixture: ComponentFixture<ModificarEntradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarEntradaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
