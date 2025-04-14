import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RessourceService } from 'src/app/front/services/ressource.service';
import { Ressource } from 'src/classes-categorie/ressource';
import { CategorieService } from 'src/app/front/services/service-categories.service';
import { FullResources } from 'src/classes-categorie/ressource';
@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.css']
})
export class RessourcesComponent implements OnInit {
  ressources: Ressource[] = [];
  filteredRessource: Ressource[] = [];
  idCategorie: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private rs: CategorieService,
    private http: HttpClient
  ) {}

 
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('idCategorie');
    if (idParam) {
      this.idCategorie = +idParam;

      this.rs.getAllResourcesbyIdCategorie(this.idCategorie).subscribe(
        (data: FullResources) => {
          console.log('Données reçues :', data);

          // Assure-toi que data.ressources existe et est un tableau
          this.ressources = data.ressources ?? [];
          this.filteredRessource = [...this.ressources];
        },
        (error) => {
          console.error('Erreur lors de la récupération des ressources :', error);
        }
      );
    }
  }
}
