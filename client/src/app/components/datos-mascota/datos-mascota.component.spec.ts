import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosMascotaComponent } from './datos-mascota.component';

describe('DatosMascotaComponent', () => {
  let component: DatosMascotaComponent;
  let fixture: ComponentFixture<DatosMascotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosMascotaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosMascotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
