import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaMascotaComponent } from './alta-mascota.component';

describe('AltaMascotaComponent', () => {
  let component: AltaMascotaComponent;
  let fixture: ComponentFixture<AltaMascotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaMascotaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaMascotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
