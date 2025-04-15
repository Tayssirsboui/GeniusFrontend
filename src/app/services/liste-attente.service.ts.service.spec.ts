import { TestBed } from '@angular/core/testing';

import { ListeAttenteServiceTsService } from './liste-attente.service.ts.service';

describe('ListeAttenteServiceTsService', () => {
  let service: ListeAttenteServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListeAttenteServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
