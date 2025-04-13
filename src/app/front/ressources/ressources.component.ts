import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { RessourceService } from 'src/app/front/services/ressource.service';




@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.css']
})
export class RessourcesComponent implements OnInit {

  idCategorie: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupérer idCategorie depuis l'URL
    const id = this.route.snapshot.paramMap.get('idCategorie');
    if (id) {
      this.idCategorie = +id; // Convertir en nombre
    }
  }

  
}
