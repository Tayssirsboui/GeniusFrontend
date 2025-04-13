
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CategorieService } from 'src/app/front/services/service-categories.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-categorie',
  templateUrl: './add-categorie.component.html',
  styleUrls: ['./add-categorie.component.css']
})
export class AddCategorieComponent {


  form: FormGroup;
  categories: any[] = []; // Liste des catégories
  message: string = ''; // Message pour l'image sélectionnée
  successMessage: string = ''; // Message de succès après soumission
  errorMessage: string = ''; // Message d'erreur en cas de problème

  constructor(private fb: FormBuilder, private categorieService: CategorieService) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      domaine: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(35), Validators.minLength(3)]],
      image: [null, Validators.required]
    });
  }

  imagePreview: string | ArrayBuffer | null = null;

  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      // Mise à jour du formulaire avec le fichier sélectionné
      this.form.patchValue({ image: file });
  
      // Génération de l'aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
  
      // Affichage du message de confirmation
      this.message = `Image "${file.name}" ajoutée avec succès.`;
    } else {
      this.imagePreview = null;
      this.message = 'Aucune image sélectionnée.';
    }
  }
  
  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
// Méthode pour vérifier les doublons avec les bonnes propriétés
isDuplicate(nomCategorie: string, domaine: string): boolean {
  const isDuplicate = this.categories.some((categorie) => {
    // Vérification si les propriétés existent et sont non-nulles avant de les comparer
    if (!categorie.nomCategorie || !categorie.domaine) {
      console.warn('Catégorie invalide détectée :', categorie);
      return false;
    }
    // Comparaison en ignorant la casse et les espaces supplémentaires
    return (
      categorie.nomCategorie.trim().toLowerCase() === nomCategorie.trim().toLowerCase() &&
      categorie.domaine.trim().toLowerCase() === domaine.trim().toLowerCase()
    );
  });

  console.log(`Vérification des doublons pour "${nomCategorie}" et "${domaine}" :`, isDuplicate);
  return isDuplicate;
}



// Méthode pour charger toutes les catégories
loadCategories(): void {
  this.categorieService.getcategorie().subscribe({
    next: (categories) => {
      this.categories = categories;
    },
    error: (error) => {
      console.error('Erreur lors du chargement des catégories :', error);
    }
  });
}
onSubmit(): void {
  console.log('Formulaire soumis.');

  // Vérifier si le formulaire est invalide
  if (this.form.invalid) {
    alert('Veuillez remplir tous les champs correctement.');
    console.log('Formulaire invalide.');
    return;
  }

  // Charger les catégories existantes et vérifier les doublons
  this.categorieService.getcategorie().subscribe({
    next: (categories) => {
      this.categories = categories;
      console.log('Catégories existantes chargées :', this.categories);

      // Récupérer les valeurs du formulaire
      const { nom, domaine, description } = this.form.value;

      // Vérifier si les valeurs du formulaire sont valides
      if (!nom || !domaine) {
        alert('Les champs "nom" et "domaine" sont obligatoires.');
        console.log('Valeurs du formulaire invalides :', { nom, domaine });
        return;
      }

      // Vérifier si la catégorie existe déjà
      if (this.isDuplicate(nom, domaine)) {
        // Ne pas permettre l'ajout si doublon trouvé
        this.errorMessage = 'Une catégorie avec ce nom et ce domaine existe déjà.';
        this.form.reset();
        this.message = '';
        alert(this.errorMessage);
        console.log('Doublon détecté, ajout annulé.');
        return;  // Bloque l'ajout si doublon
      }

      // Préparer les données pour l'envoi
      const formData = new FormData();
      formData.append('nomCategorie', nom);
      formData.append('domaine', domaine);
      formData.append('description', description);

      // Vérifier et ajouter l'image
      const file = this.form.get('image')?.value;
      if (file instanceof File) {
        formData.append('image', file);
      } else {
        alert('Veuillez sélectionner une image valide.');
        console.log('Image invalide.');
        return;
      }

      console.log('Données envoyées au backend :', formData);

      // Appeler le service pour ajouter la catégorie
      this.categorieService.addCategorie(formData).subscribe({
        next: (response) => {
          console.log('Réponse du backend :', response);
          this.successMessage = 'Catégorie ajoutée avec succès.';
          alert('Catégorie ajoutée avec succès !');
          this.errorMessage = '';
          this.form.reset();
          this.message = '';
          this.imagePreview = null;
        },
        error: (error) => {
          console.error('Erreur lors de l’ajout de la catégorie :', error);
          this.errorMessage = 'Une erreur est survenue lors de l’ajout de la catégorie.';
          alert('Erreur lors de l’ajout de la catégorie. Veuillez réessayer.');
          this.successMessage = '';
        }
      });
    },
    error: (error) => {
      console.error('Erreur lors du chargement des catégories :', error);
      alert('Erreur lors du chargement des catégories. Veuillez réessayer.');
    }
  });
}

}
