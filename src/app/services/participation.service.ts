import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Participation } from '../models/participation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private apiUrl = 'http://localhost:8089/backend/participations';

  constructor(private http: HttpClient) {}

  ajouter(participation: Participation): Observable<Participation> {
    return this.http.post<Participation>(`${this.apiUrl}/add-participation`, participation);
  }
}
