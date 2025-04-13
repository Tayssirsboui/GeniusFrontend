import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CategorieService } from 'src/app/front/services/service-categories.service';
import { Categorie } from 'src/classes-categorie/Categorie';
import { Router } from '@angular/router';
@Component({
  selector: 'app-affichage-categorie',
  templateUrl: './affichage-categorie.component.html',
  styleUrls: ['./affichage-categorie.component.css']
})
export class AffichageCategorieComponent {


  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  categories: Categorie[] = []; // Liste des catégories récupérées
  filteredCategories: Categorie[] = []; // Liste des catégories filtrées
  selectedFilter: string = '*'; // Filtre par défaut (toutes les catégories)
  listcategorie!: Categorie[]; // Liste des catégories pour d'autres opérations

  isPressing = false;      // Si l'utilisateur appuie sur le bouton
  isConfirmed = false;     // Si la suppression est confirmée
  pressTimeout: any;       // Délai de maintien
  isLoading: boolean = false; // Etat de chargement pour la suppression

  // Propriété pour suivre l'ID de la catégorie sélectionnée
  selectedCategoryId: number | null = null;

  // Cette fonction est appelée lorsque l'utilisateur commence à appuyer sur le bouton
  startPress(categorieId: number) {
    this.selectedCategoryId = categorieId; // Stocke l'ID de la catégorie sélectionnée
    this.isPressing = true;
    this.isConfirmed = false;

    // Démarre un délai de 2 secondes pour valider la suppression
    this.pressTimeout = setTimeout(() => {
      this.isConfirmed = true;  // Confirmer la suppression après 2 secondes
      console.log('Suppression confirmée');
      // Appelez la méthode pour effectuer la suppression ici
      if (this.selectedCategoryId !== null) {
        this.deleteCategorie(this.selectedCategoryId); // Passe l'ID de la catégorie à supprimer
      }
    }, 2455);  // 2 secondes de maintien pour valider la suppression
  }

  // Cette fonction est appelée lorsque l'utilisateur relâche l'appui avant 2 secondes
  endPress() {
    if (!this.isConfirmed) {
      clearTimeout(this.pressTimeout);  // Annule le délai si l'utilisateur relâche avant 2 secondes
      this.isPressing = false;
    }
  }

  // Cette fonction est appelée si l'utilisateur déplace la souris ou annule l'appui
  cancelPress() {
    clearTimeout(this.pressTimeout);  // Annule le délai si l'utilisateur quitte le bouton
    this.isPressing = false;
  }

  constructor(private http: HttpClient, private rs: CategorieService,private router: Router) {}

  activeCardId: number | null = null;

  toggleCard(categorieId: number): void {
    // Si la carte est déjà active, la masquer, sinon l'afficher
    this.activeCardId = this.activeCardId === categorieId ? null : categorieId;
  }
  editCategory(categorie: any): void {
    // Redirige vers le formulaire d'édition avec les données de la catégorie
    this.router.navigate(['/edit-category'], { queryParams: { id: categorie.idCategorie } });
  }
 
  ngOnInit(): void {
    this.rs.getcategorie().subscribe(
      (data) => {
        this.categories = data; // Toutes les catégories récupérées
        this.filteredCategories = data; // Initialiser les catégories filtrées avec toutes les catégories

        // Appliquer la classe "show" à toutes les catégories pour l'animation initiale
        setTimeout(() => {
          this.filteredCategories.forEach((categorie) => {
            const element = document.getElementById(`category-${categorie.idCategorie}`);
            if (element) {
              element.classList.add('show');
            }
          });
        }, 50)                                
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories :', error);
      }
    );
  }
 /* // Méthode pour récupérer les domaines uniques
  getUniqueDomaines(): string[] {
    const uniqueDomaines = new Set(this.categories.map((categorie) => categorie.domaine));
    return Array.from(uniqueDomaines);
  }*/
  getUniqueCategoryNames(): string[] {
    const uniqueNames = new Set(this.categories.map((categorie) => categorie.nomCategorie));
    return Array.from(uniqueNames);
  }

  // Méthode pour supprimer une catégorie
  deleteCategorie(categorieId: number): void {
    console.log('Suppression en cours pour la catégorie ID:', categorieId); // Vérifier l'ID
    if (this.isPressing && this.isConfirmed ) {  
      this.isLoading = true;  
      this.rs.deletecategorie(categorieId).subscribe({
        next: () => {
          console.log(`Catégorie avec ID ${categorieId} supprimée avec succès.`);
          // Supprimer la catégorie localement de la liste
          this.categories = this.categories.filter(c => c.idCategorie !== categorieId);
          this.filteredCategories = this.filteredCategories.filter(c => c.idCategorie !== categorieId);
          this.isLoading = false;  // Fin du chargement
          alert('Catégorie supprimée avec succès.');
        },
        error: (error) => {
          console.error(`Erreur lors de la suppression de la catégorie avec ID ${categorieId} :`, error);
          this.isLoading = false;  // Fin du chargement
          alert('Une erreur est survenue lors de la suppression. Veuillez réessayer.');
        }
      });
    } else {
      console.log('Suppression non confirmée ou appui trop court');
      alert('Veuillez maintenir l\'appui sur le bouton pour confirmer la suppression.');
    }
  }
  

  // Méthode pour incrémenter les likes
  likee(index: number): void {
    if (this.listcategorie[index]) {
      this.listcategorie[index].likes = (this.listcategorie[index].likes || 0) + 1;
    }
  }

  // Méthode pour filtrer les catégories
  getUniqueDomaines(): string[] {
    const uniqueDomaines = new Set(
      this.categories.map((categorie) => categorie.domaine.trim().toLowerCase())
    );
    return Array.from(uniqueDomaines).map(domaine => this.capitalizeFirstLetter(domaine));
  }
  
  // Méthode pour mettre la première lettre en majuscule et le reste en minuscule
  capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  incrementLike(categorie: any): void {
    console.log('Catégorie reçue dans incrementLike :', categorie);

    // Vérifiez si l'ID de la catégorie est présent
    if (!categorie.idCategorie) {
      console.error('ID de la catégorie manquant !');
      alert('Impossible de mettre à jour les likes : ID de la catégorie manquant.');
      return;
    }

    // Incrémenter localement
    categorie.likes = (categorie.likes || 0) + 1;

    // Envoyer la nouvelle valeur au backend
    this.rs.updateCategorieLikes(categorie.idCategorie, categorie.likes).subscribe({
      next: (response) => {
        console.log(`Likes mis à jour pour la catégorie ${categorie.nomCategorie} :`, response);
      },
      error: (error) => {
        console.error(`Erreur lors de la mise à jour des likes pour la catégorie ${categorie.nomCategorie} :`, error);
        alert('Erreur lors de la mise à jour des likes. Veuillez réessayer.');
      }
    });
  }
  setFilter(filter: string): void {
    this.selectedFilter = filter;
    if (filter === '*') {
      this.filteredCategories = this.categories; // Afficher toutes les catégories
    } else {
      this.filteredCategories = this.categories.filter(
        (categorie) => this.capitalizeFirstLetter(categorie.domaine) === filter
      );
    }
    
    // Appliquer une classe "hide" à toutes les catégories avant de filtrer
    this.filteredCategories.forEach((categorie) => {
      const element = document.getElementById(`category-${categorie.idCategorie}`);
      if (element) {
        element.classList.remove('show');
        element.classList.add('hide');
      }
    });
  
    // Attendre la fin de l'animation avant de mettre à jour les catégories affichées
    setTimeout(() => {
      if (filter === '*') {
        this.filteredCategories = this.categories; // Afficher toutes les catégories
      } else {
        this.filteredCategories = this.categories.filter(
          (categorie) => this.capitalizeFirstLetter(categorie.domaine) === filter
        );
      }
  
      // Appliquer une classe "show" aux nouvelles catégories affichées
      setTimeout(() => {
        this.filteredCategories.forEach((categorie) => {
          const element = document.getElementById(`category-${categorie.idCategorie}`);
          if (element) {
            element.classList.remove('hide');
            element.classList.add('show');
          }
        });
      }, 50); // Délai pour appliquer la classe "show"
    }, 500); // Durée de l'animation CSS
  }
  

}
