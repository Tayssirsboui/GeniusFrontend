import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RessourceService {
  private apiUrl = 'http://localhost:5010/ressources'; // URL de votre backend

  constructor(private http: HttpClient) {}

  // Méthode pour ajouter une ressource
  addRessource(data: FormData, idCategorie: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idCategorie}/ajout-ressource`, data);
  }

  // Méthode pour récupérer les ressources
  getRessources(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  //méthode pour mettre à jour les ressources
  updateRessource(id: number, formData: FormData) {
    return this.http.put(`${this.apiUrl}/modify-ressource/${id}`, formData);
  }
  
  // Méthode pour supprimer une ressource
  deleteRessource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-ressource/${id}`);
  }

  // Méthode pour récupérer une ressource par ID
  getRessourceById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}

