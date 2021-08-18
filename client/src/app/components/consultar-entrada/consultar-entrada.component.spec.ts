import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarEntradaComponent } from './consultar-entrada.component';

describe('ConsultarEntradaComponent', () => {
  let component: ConsultarEntradaComponent;
  let fixture: ComponentFixture<ConsultarEntradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarEntradaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
