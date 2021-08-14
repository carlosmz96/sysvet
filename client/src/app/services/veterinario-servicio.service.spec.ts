import { TestBed } from '@angular/core/testing';

import { VeterinarioServicioService } from './veterinario-servicio.service';

describe('VeterinarioServicioService', () => {
  let service: VeterinarioServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VeterinarioServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
